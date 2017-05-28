/**
 * @component SettingsTabs
 * @description 设置面板选项卡
 * @time 2015-09-07 15:16
 * @author StarZou
 **/

var React = require('react');
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
var MeConstants = require('../../../../constants/MeConstants');
var ElementTypes = MeConstants.Elements;
var GlobalFunc=require("../../../Common/GlobalFunc");
var AnimationTab = require('./AnimationTab');
var EventTab = require('./EventTab');

var SettingsTabs = React.createClass({

    render: function () {
        var tabs = [];
        if (!Array.isArray(this.props.children)) {
            tabs.push(this.props.children)
        } else {
            tabs = this.props.children;
        }
        var item_type = tabs[0].props.attributes["item_type"];
        if (item_type == ElementTypes.picslide||!GlobalFunc.hasEventCfg(item_type)) {
            return (
                <div className="settings-tabs">
                    <Tabs className="tabs-h40">
                        <TabList>
                            <Tab>样式</Tab>
                            <Tab>动画</Tab>
                        </TabList>
                        <TabPanel>{tabs[0]}</TabPanel>
                        <TabPanel><AnimationTab attributes={this.props.element.attributes}/></TabPanel>
                    </Tabs> 
                </div>
            );
        }
        
        if (item_type == 27) {
            return (
                <div className="settings-tabs">
                    <Tabs className="tabs-h40">
                        <TabList>
                            <Tab>样式</Tab>
                            <Tab>交互</Tab>
                        </TabList>
                        <TabPanel>{tabs[0]}</TabPanel>
                        <TabPanel><EventTab attributes={this.props.element.attributes}/></TabPanel>
                    </Tabs> 
                </div>
            );
        }
        return (
            <div className="settings-tabs">
                <Tabs className="tabs-h40">
                        <TabList>
                            <Tab>样式</Tab>
                            <Tab>动画</Tab>
                            <Tab>交互</Tab>
                        </TabList>
                        <TabPanel>{tabs[0]}</TabPanel>
                        <TabPanel><AnimationTab attributes={this.props.element.attributes}/></TabPanel>
                        <TabPanel><EventTab attributes={this.props.element.attributes}/></TabPanel>
                </Tabs>
            </div>
        );
    }

});

module.exports = SettingsTabs;