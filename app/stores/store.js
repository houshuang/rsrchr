import { action, observable, computed } from 'mobx';
import fs from 'fs';
import BibtexParser from 'bib2json';
import { Raw } from 'slate';

const initialState = Raw.deserialize(
  {
    nodes: [
      {
        kind: 'block',
        type: 'paragraph',
        nodes: [
          {
            kind: 'text',
            text: '\n\n\n\n\n\n\n\n\n\n\n\n\n'
          },
          {
            kind: 'block',
            type: 'page-no',
            data: { pageno: 1 },
            nodes: [
              {
                kind: 'text',
                text: 'This is very important, do you understand me?'
              }
            ]
          }
        ]
      }
    ]
  },
  { terse: true }
);

export default class Store {
  @observable state = {
    file: '',
    page: 1,
    text: initialState,
    ref: undefined,
    search: ''
  };
  @observable refs = {};
  @observable files = [];
  @observable entries = [];
  @action updateSearch = search => {
    this.state = { ...this.state, search };
  };
  @observable texts = {};
  @action setSlate = ref => {
    this.state = { ...this.state, ref };
  };
  @computed get filteredEntries() {
    return this.entries.filter(
      x =>
        !this.state.search ||
        this.state.search === '' ||
        x.EntryKey.includes(this.state.search)
    );
  }
  @action setCanvasRef = e => this.refs.canvas = e;
  @action setTextRef = e => this.refs.divref = e;
  @action copyImage = () => {
    const snip = this.refs.canvas.getContext('2d');
    const imgData = snip.getImageData(10, 10, 250, 250);

    const canvas = document.createElement('canvas');
    canvas.width = 240;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');
    ctx.putImageData(imgData, 0, 0);
    const dataUri = canvas.toDataURL('image/png');
    this.state.text = this.state.text
      .transform()
      .insertBlock({
        type: 'image',
        isVoid: true,
        data: { src: dataUri }
      })
      .apply();
  };

  @action loadFile = file => {
    this.texts[this.state.file] = this.state.text;
    this.state = { file, page: 1, text: this.texts[file] || initialState };
  };

  @action setText = text => {
    this.state = { ...this.state, text };
  };

  getFiles = dir => {
    fs.readdir(dir, (err, files) =>
      this.setFiles(files.filter(x => x.endsWith('.pdf')))
    );
  };

  @action addSelection = () => {
    let txt;
    if (window.getSelection) {
      txt = window.getSelection();
    } else if (document.getSelection) {
      txt = document.getSelection();
    } else if (document.selection) {
      txt = document.selection.createRange().text;
    }
    this.state.text = this.state.text
      .transform()
      .insertText('\nPage ' + this.state.page + ': ' + txt.toString() + '\n')
      .apply();
  };

  @action getBib = file => {
    const parser = new BibtexParser(this.addBib);
    fs.readFile(file, { encoding: 'utf-8' }, (err, data) => parser.parse(data));
  };

  @action addBib = entries => {
    this.entries.push(entries);
  };

  @action setFiles = files => {
    this.files = files;
  };

  @action changePage = page => {
    this.state = { ...this.state, page };
  };
  @action prevPage = page => {
    console.log('prevPage');
    this.state = { ...this.state, page: Math.max(0, this.state.page - 1) };
  };
  @action nextPage = page => {
    console.log('nextPage');
    this.state = { ...this.state, page: this.state.page + 1 };
  };
}
