import { action, observable } from 'mobx';
import fs from 'fs';

export default class Store {
  @observable state = { file: '/Users/stian/Downloads/06.Glen_.pdf', page: 0 };
  @observable files = [];

  @action loadFile = file => {
    this.state = { file, page: 0 };
  };

  getFiles = dir => {
    fs.readdir(dir, (err, files) =>
      this.setFiles(files.filter(x => x.endsWith('.pdf')))
    );
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
