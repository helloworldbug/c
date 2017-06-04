/**
 * @description 关于页面内容组件
 * @time 2015-10-15
 * @author 曾文彬
**/

'use strict';

// require core module
var React = require('react'),
    ReactDOM=require("react-dom"),
    $ = require('jquery'),
    Base = require('../../utils/Base'),
    Map = require('../../utils/Map');

// require image module
var ImageModules = require('../Mixins/ImageModules');

// define MessageItem component
var MessageItem = React.createClass({  

    handleSlider(e) { 

        // $('.change-state').removeClass('site-message-box-change').find('.detail').hide();

        $(e.target)
            .parents('.change-state')
            .toggleClass('site-message-box-change')
            .find('.detail')
            .slideToggle(400, (function () {
                this.props.setHeight && this.props.setHeight($('#site_message').height());
            }).bind(this));
    },

    render() {
        return (
            <div className={ 'change-state site-message-box ' + (this.props.className || '') }>
                <h3 onClick={this.handleSlider} >
                    【{this.props.message.attributes.Internal_type}】
                    {this.props.message.attributes.Internal_title}
                    <i className="arrow arrow-up"></i>
                </h3>
                <div className="detail">
                    <p className="topic" dangerouslySetInnerHTML={{__html: this.props.message.attributes.Internal_content}}></p>
                    {/*<div className="info">
                        {this.props.message.attributes.Internal_user}
                        <br />
                        {this.props.message.attributes.Internal_time}
                    </div>*/}
                </div>
            </div>
        );
    }
});

// define AboutItem component
var AboutItem = React.createClass({

    mixins: [ImageModules],

    getSiteMsg() {
        var querySQL = 'select * from pc_Internalmsg order by createdAt desc';
        var context = this;

        fmacloud.Query.doCloudQuery(querySQL, {
            success(result) {
                // 生成站内信html
                context.setState({
                    result: context.buildSiteMsgHTML(result.results)
                });
            },
            error(error) {
                console.log(error);
            }
        });
    },

    componentWillReceiveProps(nextProps) {
        Base.backToTop($, 400);

        if (nextProps.defaultRefSign !== this.props.defaultRefSign) {

            this.setUp(ReactDOM.findDOMNode(this.refs[nextProps.defaultRefSign]));
        }
    },

    setHeight() {
        var context = this;

        return _height => {
            context.setState({
                height: _height
            });
        }
    },

    buildSiteMsgHTML(data) {
        return data.map(((item, _i) => {
            return (
                <MessageItem message={item} className={_i == 0 ? 'site-message-box-change' : void 0} setHeight={ this.setHeight() }></MessageItem>
            );
        }).bind(this));
    },

    setUp(currentNode) {
        this.switchSelectedStyle(currentNode);
        this.sliding($(currentNode).parent().index());
        this.setupParentHeight($(currentNode).parent().index());
        this.barSliding(currentNode);
    },

    handleRoute(e) {
        this.setUp(e.target);
    },

    handleSlider(e) {
        var changeElement = $(e.target).parent().next(), height;
        changeElement.parents('.change-state').toggleClass('site-message-box-change');

        changeElement.toggleClass('advert-animation')[(changeElement.css['opacity']) ? 'show' : 'hide']((function () {
            height = changeElement.height() ? 700 : 1399;

            this.setState({
                height: height
            });

        }).bind(this));
    },

    switchSelectedStyle(currentNode) {
        var selectedStyle = this.props.selectedStyle;

        $(currentNode)
            .addClass(selectedStyle)
            .parent()
            .siblings()
            .find('a')
            .removeClass(selectedStyle);
    },

    sliding(index) {
        var selectedStyle = this.props.selectedStyle;
        $(ReactDOM.findDOMNode(this.refs.parent))
            .children()
            .eq(index)
            .addClass(selectedStyle)
            .siblings()
            .removeClass(selectedStyle);
    },

    barSliding(currentNode) {
        this.setState({
            top: $(currentNode).parent().position().top
        });
    },

    setupParentHeight(index) {
        var parentNode = $(ReactDOM.findDOMNode(this.refs.parent));
        var height = parentNode.children('div').eq(index).height();

        this.setState({
            height: height
        });
    },

    setMap() {
        new Map('all_map', 'http://api.map.baidu.com/getscript?v=2.0&ak=eVNrME420wABlTipUzTN4LAs&services=&t=20151013165723', {
            point: [121.618585, 31.213204],
            city: '上海'
        });
    },

    getDefaultProps() {

        return {
            defaultRefSign: Base.getParam(location.pathname, 'action') || 'us',
            selectedStyle: 'active'
        };
    },

    getInitialState() {
        return {
            slidingTop: 0,
            top: 0,
            height: 606,
            result: null
        }
    },

    render() {
        return (
          <div className="about-main clearfix">
                <aside className="leftside">
                    <div className="leftside-top">网站导航</div>
                    <ul>
                        <li>
                            <a ref="us" href="javascript:;" onClick={this.handleRoute}>关于我们</a>
                        </li>
                        <li>
                            <a ref="join" href="javascript:;" onClick={this.handleRoute}>加入我们</a>
                        </li>
                        <li>
                            <a ref="msg" href="javascript:;" onClick={this.handleRoute}>站内信</a>
                        </li>
                        {/*<li>
                            <a ref="newer" href="javascript:;" onClick={this.handleRoute}>新手导航</a>
                        </li>
                        <li>
                            <a ref="ques" href="javascript:;" onClick={this.handleRoute}>常见问题</a>
                        </li>*/}
                        <li>
                            <a ref="service" href="javascript:;" onClick={this.handleRoute}>应用服务协议</a>
                        </li>
                    </ul>
                    {/*<span className="drowdrop" style={{top: this.state.top}}></span>*/}
                </aside>
                <article ref="parent" style={{height: this.state.height, top: this.state.slidingTop}} className="main-c">
                    {/* 关于我们 */}
                    <div id="us">
                      <div className="us">
                        <p>
                        ME 作为H5微场景旗下于2014年创建的H5自媒体品牌，广大用户可通过网页端和移动端添加图片、特效、音乐等元素制作专业互动杂志，企业内刊，营销活动等内容分享到社会化媒体平台。
                        </p>
                    <div id="all_map" className="map"></div>
                    <strong>联系我们</strong>
                    <div className="address">
                        上海市浦东新区祖冲之路1559号
                        创意大厦4001
                    </div>
                    <div className="telphone">021-58385236</div>
                    <div className="ema">
                        <a href="javascript:;">service@gli.cn</a>
                    </div>
                    </div>
                    </div>
                    {/* 加入我们 */}
                    <div id="join">
                      <div className="common-box">
                        <h3>商务经理 （2人）</h3>
                        <p>
                          岗位职责：<br />
                          1、全面负责公司产品商务合作相关事宜，规范商务流程，确保公司利益；<br />
                          2、负责重大项目的商务谈判，审核商务合同条款，组织起草合作协议；<br />
                          3、监控产品运营等工作，并对其效果进行评估；<br />
                          4、宣传渠道的开发、维护；<br />
                          5、回款管理及应收帐款催收；<br />
                        </p>
                        <br />
                        <p>
                          任职要求：<br />
                          1、大学专科及以上学历，市场营销、国际贸易、商务管理类相关专业；<br />
                          2、3年以上互联网相关领域管理工作经验；<br />
                          3、熟悉商务礼仪、技巧及相关知识；<br />
                          4、较强的亲和力和表达能力，较好的气质和谈吐，思维敏捷；<br />
                          5、形象端庄、举止文雅，有很好的职业道德观，能够承受较强的工作压力。<br />
                        </p>
                      </div>
                      <div className="common-box">
                        <h3>产品培训讲师 （2人）</h3>
                        <p>
                          岗位职责：<br />
                          1、负责制定公司相关产品业务的短、中、长期培训计划以及培训体系的建立；<br />
                          2、起草、修改和完善公司内外部培训及业务部门商业培训相关制度、流程； <br />
                          3、组织实施培训计划，保证培训质量，评估培训效果，组织培训考核； <br />
                          4、负责公司产品对外宣传推广，演讲工作；<br />
                        </p>
                        <br />
                        <p>
                          任职要求：<br />
                          1、专科以上学历，具有2年以上培训讲师工作经验；<br />
                          2、能独立完成主持培训任务，现场组织把控力强；<br />
                          3、具有很强的沟通能力，现场控制能力；<br />
                          4、熟练运用各种常用办公软件（如：Word 、Excel 、PPT等）；<br />
                          5、形象气质佳、普通话流利、口齿清晰、演讲感染力强、富有激情，有较强的逻辑思维能力、组织策划及商业演讲能力；<br />
                          6、能适应短期出差，互联网行业优先。<br />
                        </p>
                      </div>
                      <div className="common-box">
                        <h3>美术编辑/平面设计师 （5人）</h3>
                        <p>
                          岗位职责：<br />
                          1、APP模板图片、产品描述页面的制作、美化，独立完成产品处理；<br />
                          2、各种活动、专题页面的制作；<br />
                          3、前期产品介绍排版及按标准录入；<br />
                          4、不断丰富和提高自身的美术设计能力，为系统开发、专题建设提供更好的服务；<br />
                          5、完成上级领导安排的各项工作。<br />
                        </p>
                        <br />
                        <p>
                          任职要求：<br />
                          1、大专或以上学历，一年以上实际工作经验；<br />
                          2、熟悉html 、div+css布局，对JavaScript有一定的了解, 能够独立完成静态网页设计工作。<br />
                          3、具备一定的美术功底，有独到的审美能力，擅长创意设计，熟悉各种平面设计，熟练使用<br />
                          PHOTOSHOP、ILLUSTRATOR、in design绘图软件和Dreamweaver网页制作工具。
                          4、学习能力强，富有团队精神，责任感和沟通能力，乐于配合和协作他人共同完成工作。<br />
                          5、优秀实习生亦可考虑，有广告公司设计经验者优先。<br />
                        </p>
                      </div>
                      <div className="common-box">
                        <h3>高级前端开发工程师 （6人）</h3>
                        <p>
                          岗位职责：<br />
                          1、依据产品需求, 配合设计师完成Web前端表现层开发；<br />
                          2、和后台开发人员共同制定前后端交互的架构设计和开发；<br />
                          3、移动端HTML5开发和研究；<br />
                          4、JavaScript程序模块开发，通用类库、框架编写；<br />
                          5、促进产品易用性改进和界面技术优化。<br />
                        </p>
                        <br />
                        <p>
                          任职要求：<br />
                          1、两年以上前端开发经验，参与设计过成熟的项目，有移动端开发实战经验, 有成功作品；<br />
                          2、精通(X)HTML/HTML5、CSS3, 对语义化、模板化、模块化有深刻的理解；<br />
                          3、理解并掌握JavaScript语言核心技术DOM、BOM、Ajax、JSON等，对jQuery等框架有丰富的应用经验；<br />
                          4、对CSS/JavaScript性能优化有一定的经验，熟悉并处理过大量浏览器兼容性问题；<br />
                          5、对用户体验、交互操作流程、及用户需求有一定了解；<br />
                          6、熟练网页性能优化和站点速度优化，了解如何实现更快速的Web加载、执行和渲染；<br />
                          7、能时刻关注新技术应用，并乐于转化为实际生产力；<br />
                          8、性格健康,逻辑性强，具备良好的责任心、较强的学习能力、优秀的团队沟通与协作能力；<br />
                        </p>
                      </div>
                    </div>
                    {/* 站内信 */}
                    <div id="site_message">{this.state.result}</div>
                    {/* 新手导航 */}
                    {/*<div id="novice_nav">
                      <div className="video">
                        <video controls="controls" preload="auto" width="100%" id="videoId">
                          <source src="http://ac-hf3jpeco.clouddn.com/b299caaf2254efdbfb8b.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                      </div>
                    </div>*/}
                    {/* 常见问题 */}
                    {/*<div id="questions" className="change-state">
                      <div className="common-box">
                        <h3>
                            什么是视频通用代码？
                            <i className="arrow arrow-up" onClick={this.handleSlider}></i>
                        </h3>
                        <div className="advert advert-animation">
                                <img className="advert-img" src={this.defineImageModules()['video_youku']} />
                                <img className="advert-img" src={this.defineImageModules()['video_tudou']} />
                                <img className="advert-img" src={this.defineImageModules()['video_qq']} />
                        </div>
                      </div>
                      <div className="common-box">
                        <h3>APP的账号可以登录PC端吗?</h3>
                        <p>亲，可以的，我们会保存您的账户和作品信息。</p>
                      </div>
                      <div className="common-box">
                        <h3>PC端可以修改APP端制作的作品吗？</h3>
                        <p>暂时不支持互通制作；我们提供一个账号体系，两端浏览作品。</p>
                      </div>
                      <div className="common-box">
                        <h3>如何制作一个作品，没有尾页？</h3>
                        <p>在发布界面，类型选择“行业”即可。</p>
                      </div>
                      <div className="common-box">
                        <h3>如何阅读H5微场景？</h3>
                        <p>用微信扫描网站图片上的二维码，先用鼠标放在每本杂志右下方的二维码logo，之后二维码会浮现在杂志封面上，扫描即可。</p>
                      </div>
                      <div className="common-box">
                        <h3>制作特色H5微场景需要什么条件？</h3>
                        <p>漂亮清晰的图片，匹配的音乐，图文比例合适，而且以图为主，一张好图胜千言万语。</p>
                      </div>
                      <div className="common-box">
                        <h3>我的H5微场景想采用电脑保存的音乐可以吗？</h3>
                        <p>当然可以，你打开添加音乐页面，添加本地音乐。</p>
                      </div>
                    </div>*/}
                    {/* 应用服务协议 */}
                    <div id="protol">
                    <div className="protol">
                      ME应用服务协议<br />
                      【导言】<br />
                      <br />
                      欢迎你使用ME应用！<br />
                      <br />
                      为使用ME应用服务（以下简称“本服务”），您应当阅读并遵守《ME服务协议》（以下简称“本协议”）。请您务必审慎阅读、充分理解各条款内容，特别是免除或限制责任的相应条款，并选择接受或不接受。<br />
                      <br />
                      除非您已阅读并接受本协议所有条款，否则您无权使用ME应用平台及服务。您对本服务的登录、查看、制作、使用等行为即视为您已阅读并同意本协议的约束。<br />
                      <br />
                      一、 【认证开通】<br />
                      <br />
                      1.1 用户应当如实填写和提交帐号注册与认证资料，并对资料的真实性、合法性、准确性和有效性承担责任。<br />
                      <br />
                      1.2 ME应用认证仅限于用户的资质审核，ME仅对用户提交的资料和信息进行审核，并不对用户实际运营行为承担任何责任或提供任何担保。因用户行为导致与其他用户或第三方发生争议的，由用户独立对外承担责任，因此给ME、其他用户或第三方造成损害的，应当依法予以赔偿。<br />
                      <br />
                      1.3 用户购买的应用服务费用以本合同列明为准，场景应用以现有产品功能形态交付。<br />
                      <br />
                      二、 【信息安全】<br />
                      <br />
                      2.1 保护信息安全是ME的一项基本原则，ME将会采取合理的措施保护用户信息及数据。除法律法规规定的情形外，未经用户许可ME不会向第三方公开、透露用户信息及数据。ME对相关信息采用专业加密存储与传输方式，保障信息的安全。<br />
                      <br />
                      2.2 ME应用管理后台密码由您自行设定。ME特别提醒您应妥善保管您的帐号和密码。ME与您共同负有维护帐号安全的责任。ME会采取并不断更新技术措施，努力保护您的帐号在服务器端的安全。您需要采取特定措施保护您的帐号安全，包括但不限于妥善保管应用帐号与密码、安装防病毒木马软件、定期更改密码等措施。当您使用完毕后，应安全退出。您同意在任何情况下不向他人透露帐号或密码信息。因您保管不善可能导致遭受盗号或密码失窃，责任由您自行承担。<br />
                      <br />
                      三、 【用户行为规范】<br />
                      <br />
                      3.1 您理解并同意，ME应用平台仅为用户提供信息分享、传播及获取的平台，您必须为自己帐号下的一切行为负责，包括您所发表的任何内容以及由此产生的任何后果。您应对本服务中的内容自行加以判断，并承担因使用内容而引起的所有风险，包括因对内容的正确性、完整性或实用性的依赖而产生的风险。ME无法且不会对因前述风险而导致的任何损失或损害承担责任。<br />
                      <br />
                      3.2 您理解并同意，ME一直致力于为用户提供文明健康、规范有序的网络环境，您不得利用应用服务制作、复制、发布、传播如下干扰场景应用平台正常运营，以及侵犯其他用户或第三方合法权益的内容：<br />
                      <br />
                      3.2.1 发布、传送、传播、储存违反国家法律法规禁止的内容：<br />
                      <br />
                      （1）违反宪法确定的基本原则的；<br />
                      <br />
                      （2）危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；<br />
                      <br />
                      （3）损害国家荣誉和利益的；<br />
                      <br />
                      （4）煽动民族仇恨、民族歧视，破坏民族团结的；<br />
                      <br />
                      （5）破坏国家宗教政策，宣扬邪教和封建迷信的；<br />
                      <br />
                      （6）散布谣言，扰乱社会秩序，破坏社会稳定的；<br />
                      <br />
                      （7）散布淫秽、色情、赌博、暴力、恐怖或者教唆犯罪的；<br />
                      <br />
                      （8）侮辱或者诽谤他人，侵害他人合法权益的；<br />
                      <br />
                      （9）煽动非法集会、结社、游行、示威、聚众扰乱社会秩序；<br />
                      <br />
                      （10）以非法民间组织名义活动的；<br />
                      <br />
                      （11）含有法律、行政法规禁止的其他内容的。<br />
                      <br />
                      3.2.2 发布、传送、传播、储存侵害他人名誉权、肖像权、知识产权、商业秘密等合法权利的内容；<br />
                      <br />
                      3.2.3 涉及他人隐私、个人信息或资料的；<br />
                      <br />
                      3.2.4 发表、传送、传播骚扰、广告信息及垃圾信息或含有任何性或性暗示的；<br />
                      <br />
                      3.2.5 其他违反法律法规、政策及公序良俗、社会公德或干扰场景应用平台正常运营和侵犯其他用户或第三方合法权益内容的信息。<br />
                      <br />
                      四、 【服务与维护】<br />
                      <br />
                      4.1 ME负责场景应用平台的维护及程序故障的处理，保证网络系统的正常运行，即客户能正常浏览场景应用。如因ME原因造成系统运行故障，应在24小时内响应并提供解决方案。<br />
                      <br />
                      4.2 ME负责在产品服务设计功能范围内解决用户在内容制作过程中遇到的技术问题。<br />
                      <br />
                      4.3 ME负责服务器维护和管理，由于应用产品改版、升级、更新等，必要时可以短时间中断服务。<br />
                      <br />
                      五、 【风险与免责】<br />
                      <br />
                      5.1 用户在使用本服务时，须自行承担如下ME不可掌控的风险内容，包括但不限于：<br />
                      <br />
                      5.1.1 由于受到计算机病毒、木马或其他恶意程序、黑客攻击的破坏等不可抗拒因素可能引起的信息丢失、泄漏等风险；<br />
                      <br />
                      5.1.2 用户电脑软件、系统、硬件和通信线路出现故障；<br />
                      <br />
                      5.1.3 用户操作不当或通过非ME授权的方式使用本服务；<br />
                      <br />
                      5.1.4 用户发布的内容被他人转发、分享，因此等传播可能带来的风险和责任；<br />
                      <br />
                      5.1.5 由于网络信号不稳定等原因，所引起的场景应用登录失败、资料同步不完整、页面打开速度慢等风险。<br />
                      <br />
                      5.1.6 其他ME无法控制或合理预见的情形。<br />
                      <br />
                      5.2 您理解并同意，用户通过ME应用发布的内容一经发布即向公众传播和共享，可能会被其他用户或第三方复制、转载、修改或做其他用途，脱离您的预期和控制，用户应充分意识到此类风险的存在，任何您不愿被他人获知的信息都不应在应用发布。如果相关行为侵犯了您的合法权益，您可以向ME投诉，我们将依法进行处理。<br />
                      <br />
                      5.3 ME依据本协议约定获得处理违法违规内容或行为的权利，该权利不构成ME的义务或承诺，ME不能保证及时发现违法违规情形或进行相应处理。<br />
                      <br />
                      六、 【知识产权声明】<br />
                      <br />
                      6.1 除另有特别声明外，ME提供应用服务时所依托软件的著作权、专利权及其他知识产权均归ME所有。<br />
                      <br />
                      6.2 用户在使用本服务中所产生的内容的知识产权归用户或相关权利人所有，用户群发的内容一经发布即向公众传播和共享，您同意ME免费使用、传播、分发、展示相关内容。<br />
                      <br />
                      6.3 上述及其他任何本服务包含的内容的知识产权均受到法律保护，其他未经ME、用户或相关权利人许可的第三人，不得以任何形式进行使用或创造相关衍生作品<br />
                      <br />
                      七、 【法律责任】<br />
                      <br />
                      7.1 如果ME发现或收到他人举报或投诉用户违反本协议约定的，ME有权不经通知随时对相关内容进行删除、屏蔽，并视行为情节对违规帐号处以包括但不限于警告、删除部分或全部违规内容、限制或禁止使用部分或全部功能、帐号封禁直至注销的处罚，并公告处理结果。如果您发现任何人违反本协议规定或以其他不当的方式使用应用服务，请立即向ME举报或投诉，我们将依法进行处理。<br />
                      <br />
                      7.2 您理解并同意，ME有权依合理判断对违反有关法律法规或本协议规定的行为进行处罚，对违法违规的任何人士采取适当的法律行动，并依据法律法规保存有关信息向有关部门报告等，用户应独自承担由此而产生的一切法律责任。<br />
                      <br />
                      7.3 您理解并同意，因您违反本协议或相关服务条款的规定，导致或产生第三方主张的任何索赔、要求或损失，您应当独立承担责任；ME因此遭受损失的，您也应当一并赔偿。<br />
                      <br />
                      7.4 如因ME原因造成应用无法正常运作的，用户可获相应赔偿，最高金额不超过本合同所签金额。<br />
                      <br />
                      八、 【其他】<br />
                      <br />
                      8.1 您使用本服务即视为您已阅读并同意受本协议的约束。<br />
                      <br />
                      8.2 本协议签订地为中华人民共和国上海市浦东新区。<br />
                      <br />
                      8.3 本协议的成立、生效、履行、解释及纠纷解决，适用中华人民共和国大陆地区法律（不包括冲突法）。<br />
                      <br />
                      8.4 若您和ME之间发生任何纠纷或争议，首先应友好协商解决；协商不成的，您同意将纠纷或争议提交本协议签订地有管辖权的人民法院管辖。<br />
                      <br />
                      8.5 本协议条款无论因何种原因部分无效或不可执行，其余条款仍有效，对双方具有约束力。（正文完）<br />
                      <br />
                      上海精灵天下科技有限公司<br />
                      </div>
                    </div>
                </article>
            </div>
        );
    },

    componentDidMount() {
        // 获取暂内信
        this.getSiteMsg();

        // 设置地图
        this.setMap();
        this.setUp(ReactDOM.findDOMNode(this.refs[this.props.defaultRefSign]));
    }
});

// exports AboutItem component
module.exports = AboutItem;
