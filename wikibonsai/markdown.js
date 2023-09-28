const fs = require('fs');
const path = require('path');

const wikirefs = require('wikirefs');


// markdown-it-wikirefs options
module.exports = function (md) {
  return {
    attrs: {
      render: true, // set this to false to turn off attrbox rendering
    },
    // render configs
    // to access data: env.collections.all[i].data
    resolveHtmlHref: (env, fname) => {
      // markdown
      if (!wikirefs.isMedia(fname)) {
        let doc = env.collections.all.find((doc) => {
          return (fname === path.basename(doc.data.page.inputPath).replace(/\.[^/.]+$/, ''));
        });
        if (doc) { return doc.data.page.url; }
      // media
      } else {
        // todo: these paths are all basically guessing where media files may be stored
        // based on how images are allocated in the eleventy base template
        if (wikirefs.CONST.EXTS.AUD.has(path.extname(fname))) {
          return '/audio/' + fname;
        }
        if (wikirefs.CONST.EXTS.IMG.has(path.extname(fname))) {
          return '/img/' + fname;
        }
        if (wikirefs.CONST.EXTS.VID.has(path.extname(fname))) {
          return '/video/' + fname;
        }
      }
    },
    resolveHtmlText: (env, fname) => {
      let doc = env.collections.all.find((doc) => {
        return (fname === path.basename(doc.data.page.inputPath).replace(/\.[^/.]+$/, ''));
      });
      if (doc && doc.data && doc.data.title) { return doc.data.title.toLowerCase(); }
      return fname;
    },
    // resolveDocType: () => {};
    // resolveEmbedContent: () => // see .eleventy.js for implementation; define close to markdown-it instance
    // metadata configs
    // see: https://github.com/11ty/eleventy/issues/1510#issuecomment-1046128400
    addAttr: (env, attrtype, thatFname) => {
      let thisFname = path.basename(env.page.inputPath).replace(/\.[^/.]+$/, '');
      let thisDoc = env.collections.all.find((doc) => {
        return (thisFname === path.basename(doc.data.page.inputPath).replace(/\.[^/.]+$/, ''));
      });
      let thatDoc = env.collections.all.find((doc) => {
        return (thatFname === path.basename(doc.data.page.inputPath).replace(/\.[^/.]+$/, ''));
      });
      // skip index docs metadata
      const indexDocPaths = thisDoc.data.collections.index.map((doc) => doc.inputPath);
      if (indexDocPaths.includes(thisDoc.inputPath)
        || ((thatDoc !== undefined)
          && indexDocPaths.includes(thatDoc.inputPath))
      ) {
        return;
      }
      // zombie case
      if (!thatDoc) {
        thatDoc = {
          inputPath: thatFname,
          data: {
            title: thatFname,
          },
        };
      }
      // fore
      if (!Object.keys(thisDoc.data).includes('foreattrs')) {
        thisDoc.data['foreattrs'] = {};
      }
      if (!Object.keys(thisDoc.data['foreattrs']).includes(attrtype)) {
        thisDoc.data['foreattrs'][attrtype] = [thatDoc];
      } else {
        // skip duplicates
        if (!thisDoc.data['foreattrs'][attrtype].includes(thisDoc)) {
          thisDoc.data['foreattrs'][attrtype].push(thisDoc);
        }
      }
      // back
      if (!Object.keys(thatDoc.data).includes('backattrs')) {
        thatDoc.data['backattrs'] = {};
      }
      if (!Object.keys(thatDoc.data['backattrs']).includes(attrtype)) {
        thatDoc.data['backattrs'][attrtype] = [thisDoc];
      } else {
        // skip duplicates
        if (!thatDoc.data['backattrs'][attrtype].includes(thisDoc)) {
          thatDoc.data['backattrs'][attrtype].push(thisDoc);
        }
      }
    },
    addLink: (env, linktype, thatFname) => {
      let thisFname = path.basename(env.page.inputPath).replace(/\.[^/.]+$/, '');
      let thisDoc = env.collections.all.find((doc) => {
        return (thisFname === path.basename(doc.data.page.inputPath).replace(/\.[^/.]+$/, ''));
      });
      let thatDoc = env.collections.all.find((doc) => {
        return (thatFname === path.basename(doc.data.page.inputPath).replace(/\.[^/.]+$/, ''));
      });
      // skip index docs metadata
      const indexDocPaths = thisDoc.data.collections.index.map((doc) => doc.inputPath);
      if (indexDocPaths.includes(thisDoc.inputPath)
        || ((thatDoc !== undefined)
          && indexDocPaths.includes(thatDoc.inputPath))
      ) {
        return;
      }
      // zombie case
      if (!thatDoc) {
        thatDoc = {
          inputPath: thatFname,
          data: {
            title: thatFname,
          },
        };
      }
      // fore
      if (!Object.keys(thisDoc.data).includes('forelinks')) {
        thisDoc.data['forelinks'] = [];
      }
      // skip duplicates
      if (!thisDoc.data['forelinks'].map((flink) => flink.doc.url).includes(thatDoc.data.url)) {
        thisDoc.data['forelinks'].push({
          type: linktype,
          doc: thatDoc,
        });
      }
      // back
      if (!Object.keys(thatDoc.data).includes('backlinks')) {
        thatDoc.data['backlinks'] = [];
      }
      // skip duplicates
      if (!thatDoc.data['backlinks'].map((blink) => blink.doc.url).includes(thisDoc.data.url)) {
        thatDoc.data['backlinks'].push({
          type: linktype,
          doc: thisDoc,
        });
      }
    },
    addEmbed: (env, thatFname) => {
      let thisFname = path.basename(env.page.inputPath).replace(/\.[^/.]+$/, '');
      let thisDoc = env.collections.all.find((doc) => {
        return (thisFname === path.basename(doc.data.page.inputPath).replace(/\.[^/.]+$/, ''));
      });
      let thatDoc = env.collections.all.find((doc) => {
        return (thatFname === path.basename(doc.data.page.inputPath).replace(/\.[^/.]+$/, ''));
      });
      // skip index docs metadata
      const indexDocPaths = thisDoc.data.collections.index.map((doc) => doc.inputPath);
      if (indexDocPaths.includes(thisDoc.inputPath)
        || ((thatDoc !== undefined)
          && indexDocPaths.includes(thatDoc.inputPath))
      ) {
        return;
      }
      // zombie case
      if (!thatDoc) {
        thatDoc = {
          inputPath: thatFname,
          data: {
            title: thatFname,
          },
        };
      }
      // fore
      if (!Object.keys(thisDoc.data).includes('foreembeds')) {
        thisDoc.data['foreembeds'] = [];
      }
      if (!thisDoc.data['foreembeds'].map((fembed) => fembed.doc.url).includes(thatDoc.data.url)) {
        thisDoc.data['foreembeds'] = [{
          doc: thatDoc,
        }];
      }
      // back
      if (!Object.keys(thatDoc.data).includes('backembeds')) {
        thatDoc.data['backembeds'] = [];
      }
      if (!thatDoc.data['backembeds'].map((bembed) => bembed.doc.url).includes(thisDoc.data.url)) {
        thatDoc.data['backembeds'] = [{
          doc: thisDoc,
        }];
      }
    },
  };
}
