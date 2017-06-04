/**
 * @description 帮助中心模板
 * @time 2015-10-20
 * @author 曾文彬
**/

'use strict';

// require core module
var React = require('react');

// define about component
var TemplateAbout = React.createClass({

	render() {
		return (
			<div className="abouts-right">
				<div className="abouts-list">

					{/* 每一项 */}
					<div className="about-column">
						<h3 className="tit">1.在H5微场景制作平台之引用行业模板或个人模板</h3>
						<div className="content">
							<p className="summary"></p>

						</div>
					</div>
				</div>
			</div>
		);
	}
});

// export TemplateAbout component
module.exports = TemplateAbout;