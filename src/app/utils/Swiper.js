/**
  * @name 平滑滑动
  * @author 曾文彬
  * @datetime 2015-10-27
*/

'use strict';

class Swipe {

    constructor(options = {}) {
        this.parentElement = this.$(options.parentSelector);
        this.childSelector = options.childSelector;
        this.childElements = this.$(options.childSelector, this.parentElement, 'querySelectorAll');
        this.leftElement = this.$(options.leftSelector);
        this.rightElement = this.$(options.rightSelector);
        this.activeCentClass = options.activeCentClass;
        this.activeMidClass = options.activeMidClass;

        this.computeChildCount();
        this.computeChildSize();
        this.resizeParentSize();

        this.swipe();
    }

    swipe() {
        //this.setMidClass();

        this.bindEvent({
            left: {
                element: 'leftElement',
                callback: this.leftSwipe()
            },
            right: {
                element: 'rightElement',
                callback: this.rightSwipe()
            }
        }); 
    }

    leftSwipe(event) {
        var context = this;

        return _event => {
            //--this.middleIndex;
            //this.scroll(0);
            this.changeElementPosition('append');      
        }
    }

    rightSwipe(event) {
        var context = this;

        return _event => {
            //++this.middleIndex;
            this.changeElementPosition('prepend');
            //this.scroll(1);
        }
    }

    scroll(dire) {
        var offsetLeft = this.childElements[0].offsetWidth;

        offsetLeft = (!dire ? -offsetLeft : offsetLeft);

       $(this.parentElement).animate({ left: offsetLeft + 'px' }, 500);
    }

    setMidClass() {
        this.childElements = this.$(this.childSelector, this.parentElement, 'querySelectorAll');
        $(this.childElements)
            .removeClass(this.activeCentClass + ' ' + this.activeMidClass)
            .eq(2)
            .addClass(this.activeCentClass)
            .parent()
            .eq(1).addClass(this.activeMidClass)
            .parent()
            .eq(3).addClass(this.activeMidClass);
    }

    changeElementPosition(action) {
        var currElement = $(this.childElements[action === 'prepend' ? this.childElementCount - 1 : 0]),
            cloneElement = currElement.clone();

        currElement.remove();
        cloneElement[action + 'To']($(this.parentElement));
        this.setMidClass();
    }

    $(selector, parent, querySelector) {
        parent = parent || document;
        querySelector = querySelector || 'querySelector';

        return parent[querySelector](selector); 
    }

    computeChildCount() {
        this.childElementCount = this.childElements.length;
    }

    computeChildSize() {
        this.childElementSize = parseInt(this.childElements[0].offsetWidth);
    }

    resizeParentSize() {
        var parentElementSize = this.childElementSize * (this.childElementCount - 3) + this.childElements[1].offsetWidth * 2 + this.childElements[2].offsetWidth;
        this.parentElement.style.width = parentElementSize + 'px';
    }

    bindEvent(events) {
        var event, element, callback;

        Object.keys(events).forEach((_event => {
            event = events[_event];

            element = event.element;
            callback = event.callback;

            this[element].addEventListener('click', callback);
        }).bind(this));
    }

}

module.exports = Swipe;