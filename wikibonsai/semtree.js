const fs = require("fs");
const path = require("path");
const glob = require("glob");
const matter = require('gray-matter');
const semtree = require('semtree');
const constants = require('./const');


module.exports = function buildBonsai() {
  // init vars
  const opts = {
    virtualTrunk: true,
    // semtree options here...
    // https://github.com/wikibonsai/semtree?tab=readme-ov-file#options
  };
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
  let bonsai = 'uninitialized bonsai';
  try {
    // build bonsai tree data struct
    bonsai = semtree.create(constants.ROOT_FNAME, bonsaiText, opts);
    const files = glob.sync(constants.ENTRIES_GLOB, {});
    for (let node of bonsai.nodes) {
      const file = files.find((file) => path.basename(file, '.md') == node.text);
      if (file !== undefined) {
        node.url = '/entries/' + path.basename(file, '.md');
      }
    }
    console.log('bonsai: \n'
      + '\n---\n'
      + 'root: ' + bonsai.root
      + '\n---\n'
      + 'trunk: ' + bonsai.trunk
      + '\n---\n'
      + 'petioleMap: ' + JSON.stringify(bonsai.petioleMap)
      + '\n---\n'
      + 'orphans: ' + bonsai.orphans
      + '\n---\n'
      + 'nodes: ' + JSON.stringify(bonsai.nodes)
      + '\n---\n'
    );
    return bonsai;
  } catch (e) {
    console.error(e, bonsai);
  }
}
