const path = require("path");

module.exports = {
	eleventyComputed: {
		ancestors(data) {
			const node = data.tree.find((node) => node.text == path.basename(data.page.inputPath, '.md'));
			return (node !== undefined) ? data.tree.filter((n) => node.ancestors.includes(n.text)) : [];
		},
		children(data) {
			const node = data.tree.find((node) => node.text == path.basename(data.page.inputPath, '.md'));
			return (node !== undefined) ? data.tree.filter((n) => node.children.includes(n.text)) : [];
		},
	}
};
