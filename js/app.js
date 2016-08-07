var	my_news	=	[
    {
        author:	'Анастасия Занина',
        text:	'Маленький проект на React.js',
        bigText:	'по методическому пособию "React.js для начинающих", автор - М.Пацанский'
    },
    {
        author:	'Гость',
        text:	'Нужно заполнить все поля!',
        bigText:	'Для отправки сообщения нужно заполнить все поля, кроме последнего, там больше кооментарий или развёрнутый текст'
    },
    {
        author:	'Другой гость',
        text:	'учить и ещё раз учить',
        bigText:	'...'
    }
];

window.ee	=	new	EventEmitter();

var	News	=	React.createClass({
    propTypes:	{
        data:	React.PropTypes.array.isRequired
    },
    getInitialState:	function()	{
        return	{
            counter:	0
        }
    },
    render:	function()	{
        var	data	=	this.props.data;
        if	(data.length	>	0) {
            var newsTemplate = data.map(function (item, index) {
                return (
                    <div key={index}>
                        <Article	data={item}	/>
                    </div>
                )
            });
        }
        else {
            newsTemplate = <p>К сожалению, новостей нет</p>
        }

        return	(
            <div	className="news">
                {newsTemplate}
                <strong
                    className={'news_count	' +	(data.length > 0 ? '':'none')}>
                    Всего	новостей:	{data.length}
                </strong>

            </div>
        );
    } });

var	Article	=	React.createClass({
    propTypes:	{
        data:	React.PropTypes.shape({
            author:	React.PropTypes.string.isRequired,
            text:	React.PropTypes.string.isRequired,
            bigText:	React.PropTypes.string.isRequired
        })
    },
    getInitialState:	function()	{
        return	{
            visible:	false
        };
    },
    readmoreClick:	function(e)	{
        e.preventDefault();
        this.setState({visible:	true});
    },
    readlessClick:	function(e)	{
        e.preventDefault();
        this.setState({visible:	false});
    },
    render:	function()	{
        var	author	=	this.props.data.author,
            text	=	this.props.data.text,
            bigText	=	this.props.data.bigText,
            visible	=	this.state.visible;
        return	(
            <div className="cloud">
                <div className="cloud-circle"></div>
                <div	className="article">
                    <p	className="news_author">{author}:</p>
                    <p	className="news_text">{text}</p>
                    <a	href="#"
                          onClick={this.readmoreClick}
                          className={'news_more ' + 'news_readmore	'	+	(visible	?	'none':	'')}>
                    </a >
                    <a	href="#"
                          onClick={this.readlessClick}
                          className={'news_more ' + 'news_readless	'	+	(visible	?	'':	'none')}>
                    </a >
                    <p	className={'news_big-text	'	+	(visible	?	'':	'none')}>
                        {bigText}
                    </p>
                </div>
            </div>
        )
    }
});

var	Add	=	React.createClass({
    getInitialState:	function()	{
        return	{
            agreeNotChecked:	true,
            authorIsEmpty:	true,
            textIsEmpty:	true,
            bigTextIsEmpty: true
        };
    },
    componentDidMount:	function()	{
        ReactDOM.findDOMNode(this.refs.author).focus();
    },
    onBtnClickHandler:	function(e)	{
        e.preventDefault();
        var	textEl	=	ReactDOM.findDOMNode(this.refs.text);
        var bigTextEl = ReactDOM.findDOMNode(this.refs.bigText);

        var	author	=	ReactDOM.findDOMNode(this.refs.author).value;
        var	text	=	textEl.value;
        var	bigText	=	bigTextEl.value;

        var	item	=	[{
            author:	author,
            text:	text,
            bigText: bigText
        }];

        window.ee.emit('News.add',	item);

        textEl.value	=	'';
        this.setState({textIsEmpty:	true});

        bigTextEl.value	=	'';
        this.setState({bigTextIsEmpty:	true});
    },
    onCheckRuleClick:	function(e)	{
        this.setState({agreeNotChecked:	!this.state.agreeNotChecked});
    },
    onFieldChange:	function(fieldName,	e)	{
        if	(e.target.value.trim().length	>	0)	{
            this.setState({[''+fieldName]:false})
        } else	{
            this.setState({[''+fieldName]:true})
        }
    },
    render:	function()	{
        var	agreeNotChecked	=	this.state.agreeNotChecked,
            authorIsEmpty	=	this.state.authorIsEmpty,
            textIsEmpty	=	this.state.textIsEmpty;
        return	(
            <div className="rocket">
                <form	className='add'>
                    <input
                        type='text'
                        className='add_author'
                        onChange={this.onFieldChange.bind(this,	'authorIsEmpty')}
                        placeholder='Автор'
                        ref='author'
                    />
                    <textarea
                        className='add_text'
                        onChange={this.onFieldChange.bind(this,	'textIsEmpty')}
                        placeholder='Текст	новости'
                        ref='text'
                    >
                    </textarea>
                    <textarea
                        className='add_bigText'
                        placeholder='Есть что добавить?'
                        ref='bigText'
                    >
                    </textarea>
                    <input
                        id="check"
                        className="checkbox"
                        type='checkbox'
                        ref='checkrule'
                        onChange={this.onCheckRuleClick}
                    />
                    <label htmlFor="check" className='add_checkrule'>
                        <span>Я согласен с запуском сообщения</span>
                    </label>
                    <button
                        className='add_btn'
                        onClick={this.onBtnClickHandler}
                        ref='alert_button'
                        disabled={agreeNotChecked	||	authorIsEmpty	||	textIsEmpty}
                    >
                        Добавить новость
                    </button>
                </form>
                <div className="orifice"></div>
            </div>
        );
    }
});



var	App	=	React.createClass({
    getInitialState:	function()	{
        return	{
            news:	my_news
        };
    },
    componentDidMount:	function()	{
        var	self	=	this;
        window.ee.addListener('News.add',	function(item)	{
            var	nextNews = item.concat(self.state.news);
            self.setState({news:	nextNews});
        });
    },
    componentWillUnmount:	function()	{
        window.ee.removeListener('News.add');
    },
    render:	function()	{
        return	(
            <div className="wrapper">
                <div className="parallax-bg1"></div>
                <div className="parallax-bg2"></div>
                <div className="parallax-bg3"></div>
                <div	className="app">
                    <div className="title">Air News</div>
                    <Add	/>
                    <News data={this.state.news} />	{/*добавили	свойство	data	*/}
                </div>
            </div>
        );
    } });

ReactDOM.render(
    <App	/>,
    document.getElementById('root')
);