import React, { Component } from "react";
import WordDefinition from "./WordDefinition";
import Tabs from "./Tabs";
import Input from "material-ui/Input";
import Button from "material-ui/Button";
import Snackbar from "material-ui/Snackbar";

let dictionary = {};
import("./dictionary.json").then(d => (dictionary = d));

const initialText = "早晨去公司食堂吃饭，要了一碗面和一个鸡蛋，面出来以后我问食堂阿姨:蛋呢？阿姨:淡？不淡了，在浇卤就咸了[病了]";

const findEntries = word =>
  word.length === 0 ? null : dictionary[word] || findEntries(word.slice(0, -1));

const ReadTab = ({ text, selected, words, setText, select, addWord }) => {
  const entries =
    typeof selected === "number"
      ? findEntries(text.slice(selected, selected + 12))
      : null;
  const entryLength = entries ? entries[0][0].length : 0;

  return (
    <div>
      <Input
        onChange={e => setText(e.target.value)}
        style={{ width: "100%" }}
        placeholder="Paste text here"
        aria-label="Save text"
      />
      <div style={{ fontSize: 30, paddingBottom: selected == null ? 40 : 190 }}>
        {text.split("").map((char, i) => {
          const isHighlighted = selected <= i && i < selected + entryLength;
          return (
            <span
              key={i}
              style={{
                color: isHighlighted ? "white" : "",
                backgroundColor: isHighlighted ? "#3f51b5" : ""
              }}
              onClick={() => select(i)}
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
                  onClick={addWord}
                />
              )
            )
          : null}
      </div>
    </div>
  );
};

const EditTab = ({ words, removeWord }) => (
  <div>
    {words.length === 0 ? (
      <div
        className="d-flex flex-column justify-content-center"
        style={{ height: "90vh" }}
      >
        <h3 className="text-center">You have no words added :(</h3>
      </div>
    ) : (
      words.map(({ word, pronunciation, definition }, i) => (
        <WordDefinition
          key={i}
          word={word}
          pronunciation={pronunciation}
          definition={definition}
          onClick={() => removeWord(i)}
          isSaved={true}
        />
      ))
    )}
  </div>
);

const ReviewTab = ({ words }) => (
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

class App extends Component {
  state = {
    tabIndex: 0,
    text: initialText,
    selected: null,
    words: JSON.parse(localStorage.words || "[]"),
    message: null
  };

  componentDidUpdate = () => {
    localStorage.words = JSON.stringify(this.state.words);
  };

  setMessage = message => {
    if (typeof this.timeoutId === "number") {
      clearTimeout(this.timeoutId);
    }
    this.setState({ message }, () => {
      this.timeoutId = setTimeout(() => {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
        this.setState({ message: null });
      }, 2000);
    });
  };

  render = () => {
    const { text, selected, words, tabIndex, message } = this.state;
    const currentTab = (() => {
      switch (tabIndex) {
        case 0:
          return (
            <ReadTab
              text={text}
              selected={selected}
              words={words}
              setText={text => this.setState({ text, selected: null })}
              select={selected => this.setState({ selected })}
              addWord={newWord => {
                this.setState(
                  { words: words.concat(newWord) },
                  () => this.setMessage(`Added ${newWord.word}`)
                );
              }}
            />
          );
        case 1:
          return (
            <EditTab
              words={words}
              removeWord={i =>
                this.setState({
                  words: words.slice(0, i).concat(words.slice(i + 1))
                })}
            />
          );
        case 2:
          return <ReviewTab words={words} />;
        default:
          throw new Error(`Invalid tab index ${tabIndex}`);
      }
    })();
    return (
      <div>
        <Tabs
          onChange={tabIndex => this.setState({ tabIndex })}
          value={tabIndex}
        />
        {currentTab}
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={!!message}
          SnackbarContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{message}</span>}
        />
      </div>
    );
  };
}

export default App;
