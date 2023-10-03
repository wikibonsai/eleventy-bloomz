const fs = require("fs");
const path = require("path");
const glob = require("glob");
const matter = require('gray-matter');
const SemTree = require('semtree').SemTree;
const constants = require('./const');


module.exports = function buildBonsai() {
  // init vars
  const bonsai = new SemTree({
    virtualTrunk: true,
    // graft: function (fname, ancestryFnames) {
    //   let doc = env.collections.all.find((doc) => {
    //     return (fname === path.basename(doc.data.page.inputPath).replace(/\.[^/.]+$/, ''));
    //   });
    //   if (doc) { return doc.data.page.url; }
    // }
    // semtree options here...
  });
  const bonsaiText = {}; // { filename: content } hash
  // build 'bonsaiText' hash
  const files = glob.sync(constants.INDEX_GLOB, {});
  files.forEach((file) => {
    const content = fs.readFileSync(file, { encoding: 'utf8' });
    const yamlData = matter(content);
    const basename = path.basename(file, '.md');
    const cleanContent = yamlData.content.replace(/^\n*/, '');
    bonsaiText[basename] = cleanContent;
  });
  let res;
  try {
    // build bonsai tree data struct
    res = bonsai.parse(bonsaiText, constants.ROOT_FNAME);
    const files = glob.sync(constants.ENTRIES_GLOB, {});
    for (let node of bonsai.tree) {
      const file = files.find((file) => path.basename(file, '.md') == node.text);
      if (file !== undefined) {
        node.url = '/entries/' + path.basename(file, '.md');
      }
    }
    return bonsai;
  } catch (e) {
    console.error(e, res);
  }
  if (bonsai.duplicates.length > 0) {
    console.log('bonsai duplicates: ' + bonsai.duplicates);
  } else {
    console.log('bonsai -- \n'
      + 'res: ' + JSON.stringify(res) + '\n'
      + 'root: ' + bonsai.root + '\n'
      + 'duplicates: ' + bonsai.duplicates
    );
  }
}
