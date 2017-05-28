/**
 * Created by 95 on 2015/11/23.
 */

///  root: children:[ {id:****},{children:[...]}]
///
///
var _ = require("lodash");
var clientStateMap = {}

function getPageClientCollection(pageId,CollectionName) {
    if (typeof clientStateMap[pageId] != "object") {
        return [];
    } else if (!clientStateMap[pageId][CollectionName]) {
        return [];
    }
    return clientStateMap[pageId][CollectionName];
}
function setPageClientCollection(pageId,CollectionName,obj) {
    if (typeof clientStateMap[pageId] != "object") {
        clientStateMap[pageId] = {}
    }
    clientStateMap[pageId][CollectionName] = obj;
}

function getLocked(pageId) {
    return getPageClientCollection(pageId,"locked");
}
function setLocked(pageId, obj) {
    setPageClientCollection(pageId, "locked",obj)
}

function getCompose(pageId) {
    return getPageClientCollection(pageId,"group");
}
function setCompose(pageId, composeArr) {
    setPageClientCollection(pageId, "group",composeArr)
}
function findGroupRoot(el, pageId) {
    var tempRoot = el;
    var groups = getCompose(pageId);
    for (var i = 0; i < groups.length; i++) {
        var agroupEl = getElsByGroup(groups[i]);
        if (_.find(agroupEl, (chr)=> {
                return chr.id == el.get("item_uuid")
            })) {
            tempRoot = groups[i];
            break;
        }
    }
    while (tempRoot.parent) {
        tempRoot = tempRoot.parent;
    }
    return tempRoot;
}
function uniqueGroups(groupsRoot) {
    for (var i = 0; i < groupsRoot.length; i++) {
        var cursor = groupsRoot[i]
        for (var j = i + 1; j < groupsRoot.length; j++) {
            var temp = groupsRoot[j];
            if (cursor.children && cursor.children == temp.children) {
                groupsRoot.splice(j, 1);
                j--;
            }
        }
    }
}
function getElsByGroup(groupRoot) {
    var els = [];
    var tmpRoot = groupRoot;
    if (tmpRoot.children) {
        var curChildren = tmpRoot.children;
        curChildren.forEach((child)=> {
            if (child.children) {
                els = els.concat(getElsByGroup(child));
            } else {
                els.push(child);
            }
        })
    }
    return els;
}
  function getElsGroupsRoot(els, pageId) {
    var root = [];
    els.forEach((el)=> {
        var elRoot = findGroupRoot(el, pageId);
        if (el != elRoot) {
            root.push(elRoot);
        } else {
            //leaf node
            root.push({id: elRoot.get("item_uuid")});
        }
    });
    uniqueGroups(root);
    return root;
}
module.exports = {
    isElementGrouped:function(el, pageId){
        if(!pageId){
            pageId=require("../stores/PageStore").getPageUid()
        }
        return getElsByGroup(findGroupRoot(el, pageId)).length>0;
    },
    getGroupEls:function(grp, pageId){
        return getElsByGroup(grp);
    },
    getGroupElsByEl: function (el, pageId) {
        //get the some group elements
        if(!pageId){
            pageId=require("../stores/PageStore").getPageUid()
        }
        return getElsByGroup(findGroupRoot(el, pageId));
    },
    canUncompose   : function (pageId, selectArr) {
        if(!pageId){
            pageId=require("../stores/PageStore").getPageUid()
        }
        var root = getElsGroupsRoot(selectArr, pageId)
        return root.length == 1 && !!root[0].children;

    },
    canCompose     : function (pageId, selectArr) {
        if(!pageId){
            pageId=require("../stores/PageStore").getPageUid()
        }
        var root = getElsGroupsRoot(selectArr, pageId)
        return root.length > 1;

    },
    uncompose      : function (els, pageId) {
        if(!pageId){
            pageId=require("../stores/PageStore").getPageUid()
        }
        var group = findGroupRoot(els[0], pageId);
        var existGroup = getCompose(pageId);
        //delete group
        for (var i = 0; i < existGroup.length; i++) {
            var tempG = existGroup[i];
            if (tempG.children == group.children) {
                existGroup.splice(i, 1);
                i++;
            }
        }
        //get children group
        if (group.children) {
            group.children.forEach((child)=> {
                delete child.parent;
                if (child.children) {
                    existGroup.push(child)
                }
            });
            setCompose(pageId, existGroup);
        }
    },
    compose        : function (arr, pageId) {
        if(!pageId){
            pageId=require("../stores/PageStore").getPageUid()
        }
        var roots = [];
        var existGroup = getCompose(pageId);
        arr.forEach((el)=> {
            var elGroupRoot = findGroupRoot(el, pageId);
            if (el != elGroupRoot) {
                //existGroup��ɾ��elRoot
                roots.push(elGroupRoot);
            } else {
                //leaf node
                roots.push({id: elGroupRoot.get("item_uuid")});
            }

        });
        uniqueGroups(roots);
        if (roots.length > 1) {
            var newRoot = {children: roots}
            roots.forEach((el)=> {
                //delete group
                for (var i = 0; i < existGroup.length; i++) {
                    if (el.children && el.children == existGroup[i].children) {
                        existGroup.splice(i, 1);
                        i--;
                    }
                }
                el.parent = roots;
            })
        }
        if (newRoot) {
            existGroup.push(newRoot)
            setCompose(pageId, existGroup);
        }
    },
    lock           : function (els, pageId) {
        if(!pageId){
            pageId=require("../stores/PageStore").getPageUid()
        }
        var lockedObj = getLocked(pageId);
        els.forEach((el)=> {
            var item_uuid = el.get("item_uuid");
            lockedObj[item_uuid] = true;
        });
        setLocked(pageId, lockedObj)
    },
    unlock         : function (els, pageId) {
        if(!pageId){
            pageId=require("../stores/PageStore").getPageUid()
        }
        var lockedObj = getLocked(pageId);
        els.forEach((el)=> {
            var item_uuid = el.get("item_uuid");
            lockedObj[item_uuid] = false;
        });
        setLocked(pageId, lockedObj)
    },
    canLock        : function (els, pageId) {
        if(!pageId){
            pageId=require("../stores/PageStore").getPageUid()
        }
        var lockedObj = getLocked(pageId);
        return !_.every(els, (el)=> {
            return !!lockedObj[el.get("item_uuid")]
        })
    },
    canUnlock      : function (els, pageId) {
        if(!pageId){
            pageId=require("../stores/PageStore").getPageUid()
        }
        var lockedObj = getLocked(pageId);
        return !_.every(els, (el)=> {
            return !lockedObj[el.get("item_uuid")]
        })
    },
    isLocked       : function (itemId, pageId) {
        if(!pageId){
            pageId=require("../stores/PageStore").getPageUid()
        }
        if (!pageId || !itemId)return false;
        var lockedObj = getLocked(pageId);
        return !!lockedObj[itemId]
    },
    getGrpRoots:function(els, pageId){
        if(!pageId){
            pageId=require("../stores/PageStore").getPageUid()
        }
        var elsObj=getElsGroupsRoot(els, pageId);
        for(var i=0;i<elsObj.length;i++){
            if(!elsObj[i].children){
                elsObj.splice(i,1);
                i--
            }
        }
        return elsObj;
    },
    unInit:function(){
        console.log("uninit clientstate")
        function deleteGrp(root){
            if(root.children){
                root.children.forEach((item)=>{
                    if(item.children){
                        deleteGrp(item);
                    }
                    delete item.parent
                })
            }
        }
        for(var pageId in clientStateMap){
            if(clientStateMap[pageId].group){
                clientStateMap[pageId].group.forEach((grp)=>{
                    deleteGrp(grp);
                })
            }
        }
        clientStateMap={}
    }

}
