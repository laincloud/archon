import React from 'react';
import {Link} from 'react-router';
import classnames from 'classnames';

function mdlUpgrade(Component) {
  const MDLComponent = React.createClass({
    componentDidMount() {
      componentHandler.upgradeDom();
    },
    componentDidUpdate() {
      componentHandler.upgradeDom();
    },
    render() {
      return <Component {...this.props} />
    },
  });
  return MDLComponent;
}
let MDL = {};

const Icon = (props) => {
  return (<i className='material-icons' style={props.style}>{props.name}</i>);
};
MDL['Icon'] = Icon;

const ClassedButton = (props) => {
  let btnProps = {
    className: props.className,
    to: props.to,
    style: props.style,
    onClick: (evt) => props.onClick && props.onClick(evt),
  };
  if (props.id) {
    btnProps.id = props.id;
  }
  let children = [];
  let toReverse = false;
  if (props.icon) {
    const alignRight = props.iconAlign === 'right';
    toReverse = alignRight;
    let iconStyle = _.assign({}, props.iconStyle);
    if (props.title) {
      alignRight ? iconStyle['marginLeft'] = 8 : iconStyle['marginRight'] = 8;
    }
    children.push(<Icon style={iconStyle} name={props.icon} key="icon" />);
  }
  if (props.title) {
    children.push(<span key='title'>{props.title}</span>);
  }
  if (toReverse) {
    children.reverse();
  }
  return props.to ? <Link {...btnProps}>{children}</Link> : <button {...btnProps}>{children}</button>;
};

const Button = (props) => {
  const claz = classnames('mdl-button mdl-js-button mdl-js-ripple-effect', {
    'mdl-button--colored': props.color === 'colored',               
    'mdl-button--primary': props.color === 'primary',
    'mdl-button--accent': props.color === 'accent',
  });
  return <ClassedButton className={claz} {...props} />;
};
MDL['Button'] = mdlUpgrade(Button);

const IconButton = (props) => {
  const claz = classnames('mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect', {
    'mdl-color--colored': props.color === 'colored',               
    'mdl-color--primary': props.color === 'primary',
    'mdl-color--accent': props.color === 'accent',
  });
  return <ClassedButton className={claz} {...props} />;
};
MDL['IconButton'] = mdlUpgrade(IconButton);

const Menu = (props) => {
  const align = props.align || 'bottom-right';
  const claz = classnames('mdl-menu mdl-js-menu mdl-js-ripple-effect', {
    [`mdl-menu--${align}`]: true,
  });
  const onSelect = (item, index) => {
    props.onSelectChange && props.onSelectChange(item, index);
  }
  return (
    <ul className={claz} htmlFor={props.menuId}>
      {
        props.items.map((item, index) => {
          return <li className="mdl-menu__item" key={index} onClick={(evt) => onSelect(item, index) }>{item}</li>
        })
      }
    </ul>
  );
}
MDL['Menu'] = mdlUpgrade(Menu);

const CardMenuIcon = (props) => {
  return (
    <div className="mdl-card__menu">
      <IconButton {...props} />
    </div>
  );
};
MDL['CardMenuIcon'] = mdlUpgrade(CardMenuIcon);

const Card = (props) => {
  const depth = props.depth || 2;
  return (
      <div className={`mdl-card mdl-shadow--${depth}dp`} style={props.style}>
        { props.children }
      </div>
  );
}; 
MDL['Card'] = mdlUpgrade(Card);

const CardTitle = (props) => {
  let iconStyle = _.assign({}, props.iconStyle, { marginRight: 8 });
  return (
    <div className="mdl-card__title" style={props.style}>
      <h2 className="mdl-card__title-text">
        { 
          !props.icon ? null : 
            <Icon style={iconStyle} name={props.icon} />
        }
        {props.title}
      </h2>
    </div>
  );
};
MDL['CardTitle'] = mdlUpgrade(CardTitle);

const CardSupportText = (props) => {
  return (
    <div className="mdl-card__supporting-text" style={props.style}>
      {props.children}    
    </div>
  );
};
MDL['CardSupportText'] = mdlUpgrade(CardSupportText);

const CardActions = (props) => {
  const claz = classnames('mdl-card__actions', {
    'mdl-card--border': props.border === true,
  });
  let styles = _.assign({}, props.style, {
    textAlign: props.align === 'right' ? 'right' : 'left',
  });
  return (
    <div className={claz} style={styles}>
      {
        props.buttons.map((btn, index) => {
          return (
            <Button key={index} icon={btn.icon} title={btn.title} color={btn.color} to={btn.to}
              onClick={(evt) => btn.onClick && btn.onClick(evt) } />
          );
        })
      } 
    </div>
  );
};
MDL['CardActions'] = mdlUpgrade(CardActions);

const Grid = (props) => 
  <div className='mdl-grid' style={props.style}>{props.children}</div>;
MDL['Grid'] = mdlUpgrade(Grid);

const GridCell = (props) => 
  <div className={`mdl-cell mdl-cell--${props.col}-col`} style={props.style}>{props.children}</div>;
MDL['GridCell'] = mdlUpgrade(GridCell);

const Table = (props) => {
  const cellClz = (index) => {
    return classnames({
      'mdl-data-table__cell--non-numeric': props.cols[index].number === false,
    });
  }
  return (
    <table className="mdl-data-table mdl-js-data-table" style={props.style}>
      <thead>
        <tr style={ props.trStyle ? props.trStyle('head') : {} }>
          { _.map(props.cols, (col, index) => <th key={index} className={cellClz(index)} style={ props.thStyle ? props.thStyle(index) : {} }>{col.title}</th>) }
        </tr>
      </thead>
      <tbody>
        {
          _.map(props.rows, (row, index) => {
            return (
              <tr key={index} style={props.trStyle ? props.trStyle('body', index) : {} }>
                { 
                  _.map(row, (item, colIndex) => {
                    const clickable = props.tdClickable && props.tdClickable(index, colIndex)
                    return (
                      <td key={colIndex} className={cellClz(colIndex)} 
                          style={ props.tdStyle ? props.tdStyle(colIndex) : {} }>
                        { clickable ? <a href='javascript:;' onClick={clickable}>{item}</a> : <span>{item}</span> }
                      </td>
                    );
                    <td key={index} className={cellClz(index)} style={ props.tdStyle ? props.tdStyle(index) : {} }>{item}</td> 
                  })
                }
              </tr>
            );
          })
        }
      </tbody>
    </table>
  );
};
MDL['Table'] = mdlUpgrade(Table);

const Progress = (props) => {
  const clz = classnames('mdl-progress mdl-js-progress', {
    'mdl-progress__indeterminate': props.indeterminate === true,
  });
  return <div className={clz} style={props.style}></div>
};
MDL['Progress'] = mdlUpgrade(Progress);

const Spinning = (props) => {
  const clz = classnames('mdl-spinner mdl-js-spinner is-active', {
    'mdl-spinner--single-color': props.color === 'single',
  });
  return <div className={clz} style={props.style}></div>;
};
MDL['Spinning'] = mdlUpgrade(Spinning);

const InputTextField = React.createClass({
  componentDidMount() {
    componentHandler.upgradeDom();
  },

  componentDidUpdate() {
    componentHandler.upgradeDom();
  },

  getDefaultProps() {
    return {
      floatingLabel: true,
      inputType: 'text',
    };
  },

  getInitialState() {
    return {
      value: this.props.value,
    };
  },
  
  componentWillReceiveProps(next) {
    this.setState({value: next.value});
  },

  getValue() {
    if (this.state.value) {
      return this.state.value.trim();
    }

    return null;
  },

  onInputKeyDown(evt) {
    if (evt && evt.keyCode === 13) {
      this.props.onEnterPressed && this.props.onEnterPressed();
    }
  },

  render() {
    const props = this.props;
    const clz = classnames('mdl-textfield mdl-js-textfield', {
      'mdl-textfield--floating-label': props.floatingLabel === true,
      'is-invalid': !props.isValid,
      'is-dirty': !props.isValid,
    }); 
    return (
      <div className={clz} style={props.style}>
        <input ref='txtInput' type={props.inputType} pattern={props.pattern}
          value={this.state.value}
          className='mdl-textfield__input' 
          onChange={(evt) => this.setState({ value: evt.target.value })}
          onKeyDown={this.onInputKeyDown}
          id={`input__${props.name}`} />
        <label className="mdl-textfield__label" htmlFor={`input__${props.name}`}>{props.label}</label>
        { props.children }
      </div>
    );
  },
});
MDL['InputTextField'] = InputTextField;

export default MDL;
