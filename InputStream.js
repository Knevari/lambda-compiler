class InputStream {
  constructor(input) {
    this.pos = 0;
    this.line = 0;
    this.col = 0;
    this.input = input;
  }

  peek() {
    return this.input.charAt(this.pos);
  }

  next() {
    const char = this.input.charAt(this.pos++);

    if (char === "\n") {
      this.line++;
      this.col = 0;
    } else {
      this.col++;
    }

    return char;
  }

  eof() {
    return this.peek() === "";
  }

  croak(msg) {
    throw new Error(`${msg} (${this.line}:${this.col})`);
  }
}


module.exports = InputStream
