import PropTypes from "prop-types";
import React from "react";
// import { markdown } from "markdown";
import HtmlContent from "@redash/viz/lib/components/HtmlContent";

var MarkdownIt = require('markdown-it'),
md = new MarkdownIt();
md.use(require('markdown-it-container'), 'warning');
md.use(require('markdown-it-container'), 'info');
md.use(require('markdown-it-container'), 'danger');
//md.use(require('markdown-it-anchor'), {});
const anchor = require('markdown-it-anchor');
md.use(anchor.default, {symbol: ''});
md.use(require('markdown-it-imsize'));


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
