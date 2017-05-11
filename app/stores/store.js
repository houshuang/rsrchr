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
    page: 0,
    text: initialState,
    ref: undefined,
    search: ''
  };
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
      x => this.state.search === '' || x.EntryKey.includes(this.state.search)
    );
  }

  @action loadFile = file => {
    this.texts[this.state.file] = this.state.text;
    this.state = { file, page: 0, text: this.texts[file] || initialState };
  };

  @action setText = text => {
    this.state = { ...this.state, text };
  };

  getFiles = dir => {
    fs.readdir(dir, (err, files) =>
      this.setFiles(files.filter(x => x.endsWith('.pdf')))
    );
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
