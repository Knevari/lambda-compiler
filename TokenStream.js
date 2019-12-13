class TokenStream {
  keywords = ' if then else lambda λ true false '

  constructor(input) {
    this.current = null;
    this.input = input;
  }

  // Helpers
  isKeyword(value) {
    return this.keywords.indexOf(' ' + value + ' ') >= 0;
  }

  isDigit(ch) {
    return /[0-9]/i.test(ch);
  }

  isIdStart(ch) {
    return /[a-zλ_]/i.test(ch);
  }

  isId = (ch) => {
    return this.isIdStart(ch) || '?!-<>=0123456789'.indexOf(ch) >= 0;
  }

  isOpChar(ch) {
    return '+-*/%=&|<>!'.indexOf(ch) >= 0;
  }

  isPunc(ch) {
    return ',;(){}[]'.indexOf(ch) >= 0;
  }

  isWhitespace(ch) {
    return '\t\n '.indexOf(ch) >= 0;
  }

  // Useful stuff
  readWhile(predicate) {
    let str = '';
    while (!this.input.eof() && predicate(this.input.peek())) {
      str += this.input.next();
    }
    return str;
  }

  readNumber() {
    let hasDot = false;
    const number = this.readWhile(ch => {
      if (ch === '.') {
        if (hasDot) return false;
        hasDot = true;
        return true;
      }
      return this.isDigit(ch);
    });

    return { type: 'num', value: parseFloat(number) };
  }

  readIdent() {
    const id = this.readWhile(this.isId);
    return { type: this.isKeyword(id) ? 'kw' : 'var', value: id };
  }

  readEscaped(end) {
    let escaped = false, str = '';
    input.next();

    while (!this.input.eof()) {
      const ch = input.next();
      if (escaped) {
        str += ch;
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === end){
        break;
      } else {
        str += ch;
      }
    }

    return str;
  }

  readString() {
    return { type: 'str', value: this.readEscaped('"') };
  }

  skipComment() {
    this.readWhile(ch => ch !== '\n');
  }

  peek() {
    return this.current || (this.current = this.readNext());
  }

  next() {
    const token = this.current;
    this.current = null;
    return token || this.readNext();
  }

  eof() {
    return this.peek() === null;
  }

  readNext() {
    this.readWhile(this.isWhitespace);
    if (this.input.eof()) return null;

    const ch = this.input.peek();

    console.log(ch);
    if (ch === '#') {
      this.skipComment();
      return this.readNext();
    }

    if (ch === '"') return this.readString();
    if (this.isDigit(ch)) return this.readNumber();
    if (this.isIdStart(ch)) return this.readIdent();
    if (this.isPunc(ch)) return { type: 'punc', value: this.input.next() };
    if (this.isOpChar(ch)) return { type: 'op', value: this.readWhile(this.isOpChar) };
    this.input.croak('Não foi possível identificar o caractere ' + ch);
  }
}
