/**
 * @name 下载页组件
 * @time 2015-9-11
 * @author 曾文彬
 **/

'use strict';

// require core module
var React = require('react');

// require children component
var Images = require('../Common/Image');

// require common mixins
var ImageModules = require('../Mixins/ImageModules');

// define Download component
var Download = React.createClass({

    mixins: [ImageModules],

    getDefaultProps() {
        return {
            backgroundStyle: 'download-bg',
            iosDownloadURL: 'https://itunes.apple.com/cn/app/me-wei-za-zhih5wei-hai-bao/id917062901?l=en&mt=8',
            androidDownloadURL: 'http://me.agoodme.com/dl/me.apk'
        }
    },

    findNode(selector) {
        return document.querySelector(selector);
    },

    removeNodeClass(node, classes) {
        classes = classes instanceof Array ? classes : classes.split(/\s+/);

        classes.forEach((_class) => {
            node.classList.remove(_class);  
        });
    },

    render() {
        return (
            <div className="inner" style={{ paddingTop: '80px' }}>
                <div className="bgc" data-background="download"></div>
                <div className="download-logo">
                    <figure>
                        <Images className="mtimg" src={this.defineImageModules()['app_content_logo']} />

                    </figure>
                </div>
                <div className="download-content">
                    <figure>
                        <Images className="mtimg" src={this.defineImageModules()['content_talk']} />
                    </figure>
                </div>
                <div className="download-appflatm clearfix">
                    {/*<a className="btn-download btn-download-ios fl" href={this.props.iosDownloadURL} title="App Store">
                        <Images className="mtimg" src={this.defineImageModules()['ios']} width="148" />
                    </a>
                    <a className="btn-download btn-download-android fr" href={this.props.androidDownloadURL} title="Android">
                        <Images className="mtimg" src={this.defineImageModules()['android']} width="145" />
                    </a>*/}
                    <a href={this.props.iosDownloadURL} title="App Store" className="ios" target="_blank"></a>
                    <a href={this.props.androidDownloadURL} className="android" title="Android" target="_blank"></a>
                </div>
            </div>
        );
    }
});



module.exports = Download;