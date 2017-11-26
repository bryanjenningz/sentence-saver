import React, { Component } from "react";
import WordDefinition from "./WordDefinition";
import Tabs from "./Tabs";
import Input from "material-ui/Input";
import Button from "material-ui/Button";

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
    words: JSON.parse(localStorage.words || "[]")
  };

  componentDidUpdate = () => {
    localStorage.words = JSON.stringify(this.state.words);
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
        <Input
          onChange={e =>
            this.setState({ text: e.target.value, selected: null })}
          style={{ width: "100%" }}
          placeholder="Paste text here"
          aria-label="Save text"
        />
        <div
          style={{ fontSize: 30, paddingBottom: selected == null ? 40 : 190 }}
        >
          {text.split("").map((char, i) => {
            const isHighlighted = selected <= i && i < selected + entryLength;
            return (
              <span
                key={i}
                style={{
                  color: isHighlighted ? "white" : "",
                  backgroundColor: isHighlighted ? "#3f51b5" : ""
                }}
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
        <h1 style={{ textAlign: "center" }}>Review</h1>
        <div style={{ textAlign: "center" }}>Words to study: {words.length}</div>
        <Button
          raised
          color="primary"
          style={{ display: "block", margin: "20px auto" }}
        >
          Start
        </Button>
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
