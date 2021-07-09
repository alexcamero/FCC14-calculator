import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const numbers = ['zero','one','two','three','four','five','six','seven','eight','nine'];

const operators = ['divide','multiply','add','subtract'];

const symbols = {'divide':'/','multiply':'*','add':'+','subtract':'-','equals':'=','decimal':'.'};

    

class Number extends React.Component {
  constructor(props) {
    super(props);
    this.press = this.press.bind(this);
  }
  
  press() {
    this.props.press(this.props.n.toString());
  }
  
  render() {
    return (
      <button id={this.props.id} className="number" style = {this.props.style} onClick={this.press}>{this.props.n} </button>
    );
  }
}

class Operator extends React.Component {
  constructor(props) {
    super(props);
    this.press = this.press.bind(this);
  }
  
  press() {
    this.props.press(symbols[this.props.id]);
  }

  render() {
    return (
      <button id={this.props.id} className="operator" style={this.props.style} onClick={this.press}>{symbols[this.props.id]}</button>
    );
  }
}

class Display extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div id="displayContainer" className="display" style={{gridArea: "display"}}>
        <h2>{this.props.expression}</h2>
        <h1 id="display">{this.props.current}</h1>
      </div>
    );
  }
  
}

class AC extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <button id="clear" className="clear" style={{gridArea: "clear"}} onClick={this.props.press}>AC</button>
    );
  }
  
}

class Decimal extends React.Component {
  constructor(props) {
    super(props);
    this.press = this.press.bind(this);
  }
  
  press() {
    this.props.press('.');
  }
  
  render() {
    return (
      <button id="decimal" className="number" style={{gridArea: "decimal"}} onClick={this.press}>{symbols["decimal"]}</button>
    );
  }
  
}

class Equals extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <button id="equals" className="equals" style={{gridArea: "equals"}} onClick={this.props.press}>{symbols["equals"]}</button>
    );
  }
  
}

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      expression: '',
      current: '0'
    };
    
    this.expressionBuilder = this.expressionBuilder.bind(this);
    this.allClear = this.allClear.bind(this);
    this.evaluate = this.evaluate.bind(this);
  }
  
  allClear() {
    this.setState(
    {
      expression: '',
      current: '0'
    });
  }
  
  expressionBuilder(char) {
    const ops = ['*','/','+','-'];

    this.setState(state => {
      if (char == '-') {
        if ((state.expression == '') || (state.expression.includes('='))) {
          return {expression: state.current + char, current: char};
        } else if ((state.current[-1] == '-') && (state.current[-2] == '-')) {
          return {expression: state.expression, current: state.current};
        } else {
          return {expression: state.expression + char, current: char};
        }
      } else if (ops.includes(char)) {
        if ((state.expression == '') || (state.expression.includes('='))) {
          return {expression: state.current + char, current: char};
        } else if (ops.includes(state.current)) {
          return {expression: state.expression.slice(0,-1) + char, current: char};
        } else {
          return {expression: state.expression + char, current: char};
        }
      } else if (char=='.') {
        if (state.current.includes('.')) {
          return {expression: state.expression, current: state.current};
        } else if ((state.expression == '') || (state.expression.includes('='))) {
          return {expression: '0.', current: '0.'};
        } else if (ops.includes(state.current)) {
          return {expression: state.expression + '0.', current: '0.'};
        } else {
          return {expression: state.expression + '.', current: state.current + '.'};
        }
      } else if (char=='0') {
        if ((state.expression == '') || (state.expression.includes('='))) {
          return {expression: '0', current: '0'};
        } else if (state.current == '0') {
          return {expression: state.expression, current: state.current};
        } else if (ops.includes(state.current)) {
          return {expression: state.expression + '0', current: '0'};
        } else {
          return {expression: state.expression + '0', current: state.current + '0'};
        }
      } else {
        if ((state.expression == '') || (state.expression.includes('='))) {
          return {expression: char, current: char};
        } else if (ops.includes(state.current)) {
          return {expression: state.expression + char, current: char};
        } else if (state.current == '0') {
          return {expression: state.expression.slice(0,-1) + char, current: char};
        } else {
          return {expression: state.expression + char, current: state.current + char};
        }
      }
    });
  }
  
  evaluate() {
    const ops = ['+','S','/','*'];
    
    function helper(exp, j) {
      if (j >= 4) {
        return exp;
      }
      
      if (j==0) {
        exp = exp.split('').map((char, ind, arr) => {
          if ((ind != 0) && (char=='-') && (arr[ind - 1] != '-') && !(ops.includes(arr[ind - 1]))) {
            return 'S';
          } else {
            return char;
          }
        }).join('');
      }
      
      let pos = exp.indexOf(ops[j]);
      
      if (pos == -1) {
        return helper(exp, j+1);
      }
      
      if (pos == exp.length - 1) {
        return helper(exp.slice(0,-1), j+1);
      }
      
      let first_subExp = helper(exp.slice(0,pos), j+1);
      let second_subExp = helper(exp.slice(pos+1), j);
      
      if ((first_subExp == 'INFINITY') || (second_subExp == 'INFINITY')) {
        return 'INFINITY';
      }
      
      first_subExp = parseFloat(first_subExp);
      second_subExp = parseFloat(second_subExp);
      
      switch(j) {
        case 0:
          return (first_subExp + second_subExp).toString();
        case 1:
          return (first_subExp - second_subExp).toString();
        case 2:
          if (second_subExp == 0) {
            return 'INFINITY';
          } else {
            return (first_subExp / second_subExp).toString();
          }
        case 3:
          return (first_subExp * second_subExp).toString();
        default:
          return exp;
      }
    }
    
    this.setState(state => {
      let result = helper(state.expression,0);
      return {
        expression: state.expression + '=' + result,
        current: result
      };
    });
    
  }
  
  render() {
    return (
      <div id="calculator">
        <Display expression={this.state.expression} current={this.state.current} />
        <AC press={this.allClear} />
        <Equals press={this.evaluate} />
        <Decimal press={this.expressionBuilder} />
        {operators.map(op => (<Operator id={op} style={{gridArea: op}} press={this.expressionBuilder} />))}
        {numbers.map((num,i) => (<Number n={i} id={num} style={{gridArea: num}} press={this.expressionBuilder} />))}
      </div>
    );
  }
}

ReactDOM.render(<Calculator />, document.getElementById("root"));
