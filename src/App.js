import React, { Component } from "react";
import WordDefinition from "./WordDefinition";
import Tabs from "./Tabs";

let dictionary = {};
import("./dictionary.json").then(d => (dictionary = d));

const findEntries = word =>
  word.length === 0 ? null : dictionary[word] || findEntries(word.slice(0, -1));

const initialText = "早晨去公司食堂吃饭，要了一碗面和一个鸡蛋，面出来以后我问食堂阿姨:蛋呢？阿姨:淡？不淡了，在浇卤就咸了[病了]";

class App extends Component {
  state = {
    tabIndex: 0,
    text: initialText,
    selected: null,
    words: []
  };

  renderRead = () => {
    const { text, selected, words } = this.state;
    const entries =
      typeof selected === "number"
        ? findEntries(text.slice(selected, selected + 12))
        : null;

    const entryLength = entries ? entries[0][0].length : 0;
    return (
      <div>
        <input
          className="form-control"
          onChange={e =>
            this.setState({ text: e.target.value, selected: null })}
          placeholder="Paste text here"
          aria-label="Save text"
        />
        <div
          style={{ fontSize: 30, paddingBottom: selected == null ? 40 : 190 }}
        >
          {text.split("").map((char, i) => {
            return (
              <span
                key={i}
                className={
                  selected <= i && i < selected + entryLength
                    ? "bg-primary text-white"
                    : ""
                }
                style={{ position: "relative" }}
                onClick={() => this.setState({ selected: i })}
              >
                {char}
              </span>
            );
          })}
        </div>
        <div
          style={{
            position: "fixed",
            width: "100%",
            height: "150px",
            bottom: 0,
            overflowY: "auto"
          }}
        >
          {entries && entries.length > 0
            ? entries.map(
                ([traditional, simplified, pronunciation, definition], i) => (
                  <WordDefinition
                    key={i}
                    word={simplified}
                    pronunciation={pronunciation}
                    definition={definition}
                    onClick={newWord => this.setState({ words: words.concat(newWord) })}
                  />
                )
              )
            : null}
        </div>
      </div>
    );
  };

  renderStudy = () => {
    const { words } = this.state;
    return (
      <div>
        {words.length === 0 ? (
          <div
            className="d-flex flex-column justify-content-center"
            style={{ height: "90vh" }}
          >
            <h3 className="text-center">You have no words added :(</h3>
          </div>
        ) : (
          words.map(
            ({ word, pronunciation, definition }, i) => (
              <WordDefinition
                key={i}
                word={word}
                pronunciation={pronunciation}
                definition={definition}
                onClick={() => this.setState({ words: words.slice(0, i).concat(words.slice(i + 1)) })}
                isSaved={true}
              />
            )
          )
        )}
      </div>
    );
  };

  renderReview = () => {
    const { words } = this.state;
    return (
      <div
        className="d-flex flex-column justify-content-center"
        style={{ height: "90vh" }}
      >
        <h1 className="text-center">Review</h1>
        <div className="text-center">Words to study: {words.length}</div>
        <button className="btn btn-primary btn-block">Start</button>
      </div>
    );
  };

  render = () => {
    const { tabIndex } = this.state;
    return (
      <div>
        <Tabs onChange={tabIndex => this.setState({ tabIndex })} value={tabIndex} />
        {[this.renderRead, this.renderStudy, this.renderReview][tabIndex]()}
      </div>
    );
  };
}

export default App;
