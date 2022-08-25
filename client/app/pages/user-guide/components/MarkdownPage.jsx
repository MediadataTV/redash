import PropTypes from "prop-types";
import React from "react";
import HtmlContent from "@redash/viz/lib/components/HtmlContent";
import anchor from "markdown-it-anchor";
// import markdownItToc from "@/lib/markdown/markdownItToc";
const hljs = require('highlight.js');
const MarkdownIt = require('markdown-it'),
md = new MarkdownIt({
  html: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }

    return ''; // use external default escaping
  }
});
md.use(require('markdown-it-container'), 'warning');
md.use(require('markdown-it-container'), 'info');
md.use(require('markdown-it-container'), 'danger');
/* md.use(anchor, {
  permalink: anchor.permalink.linkInsideHeader(
    {
      placement: 'after',
      symbol: '<i class="fa fa-link" aria-hidden="true"></i>',
      renderHref : (slug) => {
        return document.location.pathname + '#' + slug;
      },
    }
  )
}); */
md.use(anchor);
md.use(require('markdown-it-imsize'));

/* md.use(markdownItToc, {
  transformLink: slug => {
    return document.location.pathname + '#' + slug;
  }
}); */

const MarkdownPage = ({ content }) => {
    return (
      <div>
        <div className="content">
          <div className="m-b-10 p-15 bg-white tiled">
            <HtmlContent>
              {/* {markdown.toHTML(content)} */}
              {md.render(content)}
            </HtmlContent>
          </div>
        </div>
      </div>
    );
}
MarkdownPage.propTypes = {
  content: PropTypes.string.isRequired,
};

export default MarkdownPage;
