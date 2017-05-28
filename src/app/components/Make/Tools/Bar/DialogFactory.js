var React = require("react");
var DialogStore = require("../../../../stores/DialogStore");
var MusicDialog = require("./MusicDialog");
var TipsDialog = require("./TipsDialog");
var PublishDialog = require("./PublishDialog");
var MakeFinish = require("./MakeFinish");
var CropImgDialog = require("./CropImgDialog");
var ScribbleDialog=require("./ScribbleDialog");
var MaterialDialog= require("./MaterialDialog");
var MultiSelectMaterialDialog=require("./MultiSelectMaterialDialog");
var RedEnvelopeDialog=require("./RedEnvelopeDialog");
var MergeMagazineDialog=require("./MergeMagazineDialog");
function getStateFormStore() {
    return {
        show       : DialogStore.getDisplay(),
        contentType: DialogStore.getDialogType(),
        props      : DialogStore.getProps()
    };
}

module.exports = React.createClass({

    getInitialState: function () {
        return getStateFormStore()
    },

    onChange: function () {
        this.setState(getStateFormStore());
    },

    componentDidMount: function () {
        DialogStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function () {
        DialogStore.removeChangeListener(this.onChange);
    },

    render: function () {

        var dialog;

        if (this.state.show) {
            switch (this.state.contentType) {

                case "music":
                    dialog = <MusicDialog {...this.state.props}/>;
                    break;
                case "tips":
                    dialog = <TipsDialog {...this.state.props} />;
                    break;
                case "publish":
                    dialog = <PublishDialog {...this.state.props} />;
                    break;
                case "finish":
                    dialog = <MakeFinish {...this.state.props} />;
                    break;
                case "crop":
                    dialog = <CropImgDialog {...this.state.props} />;
                    break;
                case "scribble":
                    dialog = <ScribbleDialog {...this.state.props} />;
                    break;
                case "material":
                    dialog = <MaterialDialog {...this.state.props} />;
                    break;
                case "multimaterial":
                    dialog = <MultiSelectMaterialDialog {...this.state.props} />;
                    break;
                case "redenvelope":
                    dialog = <RedEnvelopeDialog {...this.state.props} />;
                    break;
                case "mergemagazine":
                    dialog = <MergeMagazineDialog  />;
                    break;

            }
        }

        return (<div className="make-dialog">
            {dialog}
        </div>)

    }
});