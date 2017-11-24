import React, { Component } from "react";
let dictionary = {};
import("./dictionary.json").then(d => dictionary = d);

const findEntries = word =>
  word.length === 0 ? null : dictionary[word] || findEntries(word.slice(0, -1));

const initialText = "早晨去公司食堂吃饭，要了一碗面和一个鸡蛋，面出来以后我问食堂阿姨:蛋呢？阿姨:淡？不淡了，在浇卤就咸了[病了]";

class App extends Component {
  state = { route: "read", text: initialText, selected: null, words: [] };

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
        <div style={{ fontSize: 30 }}>
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
        <div>
          {entries && entries.length > 0
            ? entries.map(([trad, simp, pro, def], i) => (
                <div key={i} className="card bg-light mb-3">
                  <h4 className="card-header">
                    {simp} {pro}
                    <button
                      className="btn btn-primary float-right"
                      onClick={() =>
                        this.setState({
                          words: words.concat([[trad, simp, pro, def]]),
                          selected: null
                        })}
                    >
                      +
                    </button>
                  </h4>
                  <div className="card-body">
                    <p className="card-text">{def}</p>
                  </div>
                </div>
              ))
            : null}
        </div>
      </div>
    );
  };

  renderStudy = () => {
    const { words } = this.state;
    return (
      <div>
        {words.length === 0
          ? <div className="d-flex flex-column justify-content-center" style={{ height: "90vh" }}>
              <h3 className="text-center">You have no words added :(</h3>
            </div>
          : words.map(([trad, simp, pro, def], i) => (
              <div key={i} className="card bg-light mb-3">
                <h4 className="card-header">
                  {simp} {pro}
                  <button
                    className="btn btn-danger float-right"
                    onClick={() =>
                      this.setState({
                        words: words.slice(0, i).concat(words.slice(i + 1))
                      })}
                  >
                    x
                  </button>
                </h4>
                <div className="card-body">
                  <p className="card-text">{def}</p>
                </div>
              </div>
            ))}
      </div>
    );
  };

  renderReview = () => {
    const { words } = this.state;
    return (
      <div className="d-flex flex-column justify-content-center" style={{ height: "90vh" }}>
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
          <button
            className={`btn border ${route === "read"
              ? "btn-primary"
              : "btn-secondary"}`}
            style={{ width: "33.3333333%" }}
            onClick={() => this.setState({ route: "read" })}
          >
            Read
          </button>
          <button
            className={`btn border ${route === "study"
              ? "btn-primary"
              : "btn-secondary"}`}
            style={{ width: "33.3333333%" }}
            onClick={() => this.setState({ route: "study" })}
          >
            Study
          </button>
          <button
            className={`btn border ${route === "review"
              ? "btn-primary"
              : "btn-secondary"}`}
            style={{ width: "33.3333333%" }}
            onClick={() => this.setState({ route: "review" })}
          >
            Review
          </button>
        </div>
      </div>
    );
  };
}

export default App;
