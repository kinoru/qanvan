// @flow

import React from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery'

function commonGet(given: React, url: string) {
  $.ajax({
    url: url,
    dataType: 'json',
    cache: false,
    success: function(data) {
      given.setState({data: data['result']});
    }.bind(given),
    error: function(xhr, status, err) {
      console.error(url, status, err.toString());
    }.bind(given)
  });
}

function commonPost(given: React, url: string, data: string) {
  $.ajax({
    url: url,
    dataType: 'json',
    contentType: 'application/json',
    type: 'POST',
    data: data,
    success: function(data) {
      given.setState({data: data['result']});
    }.bind(given),
    error: function(xhr, status, err) {
      console.error(url, status, err.toString());
    }.bind(given)
  });
}

var CardList: React = React.createClass({
  render: function() {
    return (
      <div className='CardList' key='{this.props.key}'>
        <h3>{this.props.name}</h3>
      </div>
    );
  }
});

var CardLists: React = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    commonGet(this, '/board/' + this.props.chosen_board);
  },
  componentWillReceiveProps: function(nextProps) {
    commonGet(this, '/board/' + nextProps.chosen_board);
  },
  render: function() {
    var card_lists = this.state.data.map(function(card_list) {
      return <CardList key={card_list.id} name={card_list.name} />
    });
    var given = this;
    var addCardList = function(e) {
      var newName = prompt('새 리스트 이름');
      if (newName !== null) {
        commonPost(given, '/board/' + given.props.chosen_board,
            `{"name": "${newName}"}`);
      }
    };
    return (
      <div id='CardListArea' key={this.props.chosen_board}>
        <p>{this.props.chosen_board}</p>
        {card_lists}
        <div onClick={addCardList}>리스트 추가</div>
      </div>
    );
  }
});

var BoardList: React = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    commonGet(this, this.props.url);
  },
  render: function() {
    var handleBoardClick = this.props.handleBoardClick;
    var boardNodes = this.state.data.map(function(board) {
      var boardOnClick = function(e) {
        handleBoardClick(board.id);
      };
      return (
        <li className='boardName' onClick={boardOnClick} key={board.id}>
          {board.name}
        </li>
      );
    });
    var given = this;
    var addBoard = function(e) {
      var boardName = prompt("새 보드의 이름");
      if (boardName !== null) {
        commonPost(given, given.props.url, `{"name": "${boardName}"}`);
      }
    }
    return (
      <ul id='BoardList'>
        {boardNodes}
        <li className='boardName' onClick={addBoard}>보드 추가</li>
      </ul>
    );
  }
});

var Qanvan: React = React.createClass({
  getInitialState: function() { return {chosen_board: 1}; },
  handleBoardClick: function(board_id) {
    this.setState({chosen_board: board_id});
  },
  render: function() {
    return (
      <div className="Qanvan">
        <BoardList url='/board' handleBoardClick={this.handleBoardClick} />
        <CardLists chosen_board={this.state.chosen_board} />
      </div>
    );
  }
});

ReactDOM.render(
  <Qanvan />,
  document.getElementById('content')
);
