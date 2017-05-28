
var Clipboard = [];
var pageUid;
var pasteTime=-1;
var clipUtil= {
	push: function(data){
		Clipboard.length = 0;
		pasteTime=-1;
		var _data = data, i = 0, len = data.length;
		for( ; i < len ; i++ ){
			Clipboard.push(_data[i]);
		}
		return Clipboard;
	},
	pull: function(){
		var result = [], i = 0, len = Clipboard.length;
		for( ; i<len ; i++){
			result.push(Clipboard[i]);
		}
		return result;
	}
}
var ClipInterface={
	copy:function(uid){
		var ElementStore=require("../stores/ElementStore");
		var items = ElementStore.getSelectedElement();
		var _items_clone=[]
		for(var si=0;si<items.length;si++){
			var item = items[si].clone();
				_items_clone.push(item) ;
			if (item.get("group_id")) {
				var _items = ElementStore.getElements();
				for (var i = 0, j = 0; i < _items.length; i++) {
					//console.log("group_id", _items[i].attributes.group_id);
					if (_items[i].attributes.group_id == item.get("group_id") && _items[i].attributes.item_type == 17) {
						_items_clone.push(_items[i].clone());
					}
				}
			}

		}
		pageUid=uid;
		clipUtil.push(_items_clone);

	},
	getPasteElements:function(){
		pasteTime++;
		return clipUtil.pull();
	},
	getPasteTime:function()
	{
		return pasteTime;
	},
	getPageUid:function(){
		return pageUid;
	}
}



module.exports=ClipInterface
