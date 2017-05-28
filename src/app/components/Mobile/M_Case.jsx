/**
 * @component M_Index.jsx
 * @description 移动端更多案例
 * @time 2015-11-24
 * @author 曾文彬
 **/

'use strict';

var React = require('react');

var MePC = require('../../lib/MePC_Public'),
    Base = require('../../utils/Base'),
    Images = require('../Common/Image'),
    ImageModules = require('../Mixins/ImageModules');

var MSuper = require('./M_Super'); 

var MCase = MePC.inherit(MSuper, React.createClass({ 

    mixins : [ImageModules],

    /*
    * 案例列表
    */ 
    generatorCaseList:function(){
      var origin=location.origin;
        return (
            <div className="mobile-case-lists">
                <ul>
                <li>
                  <dl>
                      <dt><a href={origin+"/150b293a2547450f/shareme.html?tid=150b293a2547450f&dataFrom=pc2-0"}><Images src={this.defineImageModules()['case1']} /></a></dt>
                      <dd>
                        <div className="case-lists-info">
                          <h3>高桥工艺</h3>
                          <p>Neoe</p>
                        </div>
                        <div className="line">
                          <div></div>
                          <div></div>
                        </div>
                      </dd>
                  </dl>
                </li>
                <li>
                  <dl>
                      <dt><a href={origin+"/150cbc3f447e0ade/shareme.html?tid=150cbc3f447e0ade&dataFrom=pc2-0"}><Images src={this.defineImageModules()['case2']} /></a></dt>
                      <dd>
                        <div className="case-lists-info">
                          <h3>香奈儿</h3>
                          <p>JOJO</p>
                        </div>
                        <div className="line">
                          <div></div>
                          <div></div>
                        </div>
                      </dd>
                  </dl>
                </li>
                <li>
                  <dl>
                      <dt><a href={origin+"/150cc6176eeeb417/shareme.html?tid=150cc6176eeeb417&dataFrom=pc2-0"}><Images src={this.defineImageModules()['case3']} /></a></dt>
                      <dd>
                        <div className="case-lists-info">
                          <h3>无印良品</h3>
                          <p>贪吃小猫</p>
                        </div>
                        <div className="line">
                          <div></div>
                          <div></div>
                        </div>
                      </dd>
                  </dl>
                </li>
                <li>
                  <dl>
                      <dt><a href={origin+"/150f5548a0e2d506/shareme.html?tid=150f5548a0e2d506&dataFrom=pc2-0"}><Images src={this.defineImageModules()['case4']} /></a></dt>
                      <dd>
                        <div className="case-lists-info">
                          <h3>ZARA</h3> 
                          <p>格桑花开</p>
                        </div>
                        <div className="line">
                          <div></div>
                          <div></div>
                        </div>
                      </dd>
                  </dl>
                </li>
                <li>
                  <dl>
                      <dt><a href={origin+"/150f55e20decf391/shareme.html?tid=150f55e20decf391&dataFrom=pc2-0"}><Images src={this.defineImageModules()['case5']} /></a></dt>
                      <dd>
                        <div className="case-lists-info">
                          <h3>LAMI</h3>
                          <p>大胳波</p>
                        </div>
                        <div className="line">
                          <div></div>
                          <div></div>
                        </div>
                      </dd>
                  </dl>
                </li>
                <li>
                  <dl>
                      <dt><a href={origin+"/150f55526271f64c/shareme.html?tid=150f55526271f64c&dataFrom=pc2-0"}><Images src={this.defineImageModules()['case6']} /></a></dt>
                      <dd>
                        <div className="case-lists-info">
                          <h3>时尚芭莎</h3>
                          <p>时尚芭莎</p>
                        </div>
                        <div className="line">
                          <div></div>
                          <div></div>
                        </div>
                      </dd>
                  </dl>
                </li>
                </ul>
            </div>
        );
    },

    /*
    * 更多提示
    */ 

    generatorMoreTip:function (){
       return (
            <div className="case-more-line">
              <span className="line"></span>
              <span className="more-works">更多作品，登录 www.agoodme.com 浏览</span>
            </div>
        );
    },

    render: function () {
        this.generatorMobileMeta();
        this.generatorMobileCSSSheet();
        this.modifierRootClassByName();

        return (
            <div> 
              <div className="caseBanner"><Images src={this.defineImageModules()['mobileCaseBanner']} /></div>
              { this.generatorCaseList() }
              { this.generatorMoreTip() }
            </div>
        );
    },

    componentWillUnmount: function () {
        // 删除mobile 样式
        this.modifierRootClassByName(true);
    }
}));

module.exports = MCase;
