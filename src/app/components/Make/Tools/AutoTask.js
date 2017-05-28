/**
 *ÿ��taskInterval����겻�ƶ�idleIntervalʱ������callback��
 * �������idleInterval,��ʱֱ�ӵ���callback
 */


function AutoTask(taskInterval, callback, idleInterval) {
    this._taskInterval = taskInterval;
    this._callback = callback;
    this._idleInterval = idleInterval;
    this._detectIdle= function (e) {
        var lastPos=this.lastPos
        if (e.pageX == lastPos.x && e.pageY == lastPos.y) {
            return;
        }
        lastPos.x = e.pageX;
        lastPos.y = e.pageY;
       this.isIdle = false;

        if (this.idleTimer) {
            clearTimeout(this.idleTimer);

        }
        this.idleTimer = setTimeout(this._setIdle(), this._idleInterval);//��ʱ��isIdle��Ϊtrue
    }.bind(this)
}

Object.assign(AutoTask.prototype,{
    stop : function () {
        clearTimeout(this.timer);
        if (this._idleInterval) {
            document.removeEventListener("mousemove", this._detectIdle)
        }
    },
    start: function () {
        this.lastPos = {x: 0, y: 0};
        this.autoTaskTimeout = false;
        this.isIdle = true;
        this.idleTimer = null;
        this.timer = setTimeout(this._taskTimeout.bind(this), this._taskInterval); //��ʱ��autoTaskTimeout��Ϊtrue
        if (this._idleInterval) {
            document.addEventListener("mousemove", this._detectIdle)
        }

    },
    _taskTimeout:function(){
        this.autoTaskTimeout = true;
        this._runTask();
    },
    _runTask:function(){
        if (!this.autoTaskTimeout || !this.isIdle) {
            return;
        }
        this._callback();
        this.timer = setTimeout(this._taskTimeout.bind(this), this._taskInterval); // ��һ��
        this.autoTaskTimeout = false;
    },
    _setIdle:function(){
        this.isIdle = true;
        this._runTask();
    }

})

module.exports = AutoTask










