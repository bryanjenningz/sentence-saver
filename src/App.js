import React, { Component } from "react";
let dictionary = {};
import("./dictionary.json").then(d => (dictionary = d));

const findEntries = word =>
  word.length === 0 ? null : dictionary[word] || findEntries(word.slice(0, -1));

const initialText = "早晨去公司食堂吃饭，要了一碗面和一个鸡蛋，面出来以后我问食堂阿姨:蛋呢？阿姨:淡？不淡了，在浇卤就咸了[病了]";

class App extends Component {
  state = {
    route: "read",
    text: initialText,
    selected: null,
    words: [],
    editing: null
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
            bottom: "25px",
            overflowY: "auto"
          }}
        >
          {entries && entries.length > 0
            ? entries.map(
                ([traditional, simplified, pronunciation, definition], i) => (
                  <div key={i} className="card bg-light mb-3">
                    <h4 className="card-header">
                      {simplified} {pronunciation}
                      <button
                        className="btn btn-primary float-right"
                        onClick={() =>
                          this.setState({
                            words: words.concat({
                              traditional,
                              simplified,
                              pronunciation,
                              definition
                            }),
                            selected: null
                          })}
                      >
                        +
                      </button>
                    </h4>
                    <div className="card-body">
                      <p className="card-text">{definition}</p>
                    </div>
                  </div>
                )
              )
            : null}
        </div>
      </div>
    );
  };

  renderStudy = () => {
    const { words, editing } = this.state;
    if (typeof editing === "number") {
      const editingWord = words[editing];
      return (
        <div>
          <h1 className="text-center">Editing</h1>
          <h4>{editingWord.simplified}</h4>
          <input
            className="form-control"
            defaultValue={editingWord.simplified}
          />
          <h4>{editingWord.pronunciation}</h4>
          <input
            className="form-control"
            defaultValue={editingWord.pronunciation}
          />
          <h4>{editingWord.definition}</h4>
          <input
            className="form-control"
            defaultValue={editingWord.definition}
          />

          <div className="btn-group w-100">
            <button
              className="btn btn-primary w-50"
              onClick={() => this.setState({ editing: null })}
            >
              Save
            </button>
            <button
              className="btn btn-secondary w-50"
              onClick={() => this.setState({ editing: null })}
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

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
            ({ traditional, simplified, pronunciation, definition }, i) => (
              <div key={i} className="card bg-light mb-3">
                <h4 className="card-header">
                  {simplified} {pronunciation}
                  <div className="float-right">
                    <button
                      className="btn btn-secondary"
                      onClick={() => this.setState({ editing: i })}
                    >
                      ✎
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        this.setState({
                          words: words.slice(0, i).concat(words.slice(i + 1))
                        })}
                    >
                      x
                    </button>
                  </div>
                </h4>
                <div className="card-body">
                  <p className="card-text">{definition}</p>
                </div>
              </div>
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
    const { route } = this.state;

    return (
      <div>
        {route === "read"
          ? this.renderRead()
          : route === "study"
            ? this.renderStudy()
            : route === "review"
              ? this.renderReview()
              : `Invalid route: ${route}`}
        <div
          className="btn-group btn-block"
          style={{ position: "fixed", bottom: 0 }}
        >
          <RouteButton
            text="Read"
            route={route}
            onClick={route => this.setState({ route })}
          />
          <RouteButton
            text="Study"
            route={route}
            onClick={route => this.setState({ route })}
          />
          <RouteButton
            text="Review"
            route={route}
            onClick={route => this.setState({ route })}
          />
        </div>
      </div>
    );
  };
}

const RouteButton = ({ text, route, onClick }) => (
  <button
    className={`btn border ${route === text.toLowerCase()
      ? "btn-primary"
      : "btn-secondary"}`}
    style={{ width: "33.3333333%" }}
    onClick={() => onClick(text.toLowerCase())}
  >
    {text}
  </button>
);

export default App;
