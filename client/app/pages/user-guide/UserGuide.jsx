import { map, isArray } from "lodash";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import routeWithUserSession from "@/components/ApplicationArea/routeWithUserSession";
import PageHeader from "@/components/PageHeader";
import * as Sidebar from "@/components/items-list/components/Sidebar";
import Layout from "@/components/layouts/ContentWithSidebar";
import routes from "@/services/routes";

import 'highlight.js/styles/an-old-hope.css';
import "./UserGuide.less";
import MarkdownPage from "./components/MarkdownPage";

const sidebarMenu = [
  {
    key: 'userguide.querying',
    href: '#',
    title: 'Querying',
    children: [
      {
        key: "userguide.querying.writing",
        href: "/user-guide/querying/writing-queries",
        source: 'querying/writing-queries.md',
        title: "Creating and Editing Queries",
      },
      {
        key: "userguide.querying.syntax",
        href: "#",
        title: "Query syntax",
        children: [
          {
            key: "userguide.querying.syntax.datatypes",
            href: "/user-guide/querying/query-syntax/data-types",
            source: 'querying/query-syntax/data-types.md',
            title: "Data Types",
          },
          {
            key: "userguide.querying.syntax.functions",
            href: "/user-guide/querying/query-syntax/functions",
            source: 'querying/query-syntax/functions.md',
            title: "Functions",
          },
          {
            key: "userguide.querying.syntax.literals",
            href: "/user-guide/querying/query-syntax/literals",
            source: 'querying/query-syntax/literals.md',
            title: "Literals",
          },
          {
            key: "userguide.querying.syntax.nullsemantics",
            href: "/user-guide/querying/query-syntax/null-semantics",
            source: 'querying/query-syntax/null-semantics.md',
            title: "Null Semantics",
          },
          {
            key: "userguide.querying.syntax.dataretrieval",
            href: "#",
            title: "Data Retrieval",
            children: [
              {
                key: "userguide.querying.syntax.dataretrieval.select",
                href: "/user-guide/querying/query-syntax/data-retrieval/select",
                source: 'querying/query-syntax/data-retrieval/select.md',
                title: "SELECT",
              },
              {
                key: "userguide.querying.syntax.dataretrieval.cte",
                href: "/user-guide/querying/query-syntax/data-retrieval/common-table-expression",
                source: 'querying/query-syntax/data-retrieval/common-table-expression.md',
                title: "Common Table Expression",
              },
              {
                key: "userguide.querying.syntax.dataretrieval.cluster-by",
                href: "/user-guide/querying/query-syntax/data-retrieval/cluster-by",
                source: 'querying/query-syntax/data-retrieval/cluster-by.md',
                title: "CLUSTER BY Clause",
              },
              {
                key: "userguide.querying.syntax.dataretrieval.distribute-by",
                href: "/user-guide/querying/query-syntax/data-retrieval/distribute-by",
                source: 'querying/query-syntax/data-retrieval/distribute-by.md',
                title: "DISTRIBUTE BY Clause",
              },
              {
                key: "userguide.querying.syntax.dataretrieval.group-by",
                href: "/user-guide/querying/query-syntax/data-retrieval/group-by",
                source: 'querying/query-syntax/data-retrieval/group-by.md',
                title: "GROUP BY Clause",
              },
              {
                key: "userguide.querying.syntax.dataretrieval.having",
                href: "/user-guide/querying/query-syntax/data-retrieval/having",
                source: 'querying/query-syntax/data-retrieval/having.md',
                title: "HAVING Clause",
              },
              {
                key: "userguide.querying.syntax.dataretrieval.hints",
                href: "/user-guide/querying/query-syntax/data-retrieval/hints",
                source: 'querying/query-syntax/data-retrieval/hints.md',
                title: "Hints",
              },
              {
                key: "userguide.querying.syntax.dataretrieval.inline-table",
                href: "/user-guide/querying/query-syntax/data-retrieval/inline-table",
                source: 'querying/query-syntax/data-retrieval/inline-table.md',
                title: "Inline Table",
              },
              {
                key: "userguide.querying.syntax.dataretrieval.join",
                href: "/user-guide/querying/query-syntax/data-retrieval/join",
                source: 'querying/query-syntax/data-retrieval/join.md',
                title: "JOIN",
              },
              {
                key: "userguide.querying.syntax.dataretrieval.like",
                href: "/user-guide/querying/query-syntax/data-retrieval/like",
                source: 'querying/query-syntax/data-retrieval/like.md',
                title: "LIKE",
              },
              {
                key: "userguide.querying.syntax.dataretrieval.limit",
                href: "/user-guide/querying/query-syntax/data-retrieval/limit",
                source: 'querying/query-syntax/data-retrieval/limit.md',
                title: "LIKE",
              },
              {
                key: "userguide.querying.syntax.dataretrieval.order-by",
                href: "/user-guide/querying/query-syntax/data-retrieval/order-by",
                source: 'querying/query-syntax/data-retrieval/order-by.md',
                title: "ORDER BY Clause",
              },
              {
                key: "userguide.querying.syntax.dataretrieval.set-operators",
                href: "/user-guide/querying/query-syntax/data-retrieval/set-operators",
                source: 'querying/query-syntax/data-retrieval/set-operators.md',
                title: "Set Operators",
              },
              {
                key: "userguide.querying.syntax.dataretrieval.sort-by",
                href: "/user-guide/querying/query-syntax/data-retrieval/sort-by",
                source: 'querying/query-syntax/data-retrieval/sort-by.md',
                title: "SORT BY Clause",
              },
              {
                key: "userguide.querying.syntax.dataretrieval.tablesample",
                href: "/user-guide/querying/query-syntax/data-retrieval/tablesample",
                source: 'querying/query-syntax/data-retrieval/tablesample.md',
                title: "TABLESAMPLE",
              },
              {
                key: "userguide.querying.syntax.dataretrieval.table-valued-function",
                href: "/user-guide/querying/query-syntax/data-retrieval/table-valued-function",
                source: 'querying/query-syntax/data-retrieval/table-valued-function.md',
                title: "Table-Valued Function",
              },
              {
                key: "userguide.querying.syntax.dataretrieval.where",
                href: "/user-guide/querying/query-syntax/data-retrieval/where",
                source: 'querying/query-syntax/data-retrieval/where.md',
                title: "WHERE Clause",
              },
              {
                key: "userguide.querying.syntax.dataretrieval.window-function",
                href: "/user-guide/querying/query-syntax/data-retrieval/window-function",
                source: 'querying/query-syntax/data-retrieval/window-function.md',
                title: "Window Function",
              },
              {
                key: "userguide.querying.syntax.dataretrieval.case",
                href: "/user-guide/querying/query-syntax/data-retrieval/case",
                source: 'querying/query-syntax/data-retrieval/case.md',
                title: "CASE Clause",
              },
              {
                key: "userguide.querying.syntax.dataretrieval.pivot",
                href: "/user-guide/querying/query-syntax/data-retrieval/pivot",
                source: 'querying/query-syntax/data-retrieval/pivot.md',
                title: "PIVOT Clause",
              },
              {
                key: "userguide.querying.syntax.dataretrieval.lateral-view",
                href: "/user-guide/querying/query-syntax/data-retrieval/lateral-view",
                source: 'querying/query-syntax/data-retrieval/lateral-view.md',
                title: "LATERAL VIEW Clause",
              },
              {
                key: "userguide.querying.syntax.dataretrieval.explain",
                href: "/user-guide/querying/query-syntax/data-retrieval/explain",
                source: 'querying/query-syntax/data-retrieval/explain.md',
                title: "EXPLAIN Clause",
              }
            ]
          }
        ]
      },
/*       {
        key: "userguide.querying.results",
        href: "/user-guide/querying/query-results-data-source",
        source: 'querying/query-results-data-source.md',
        title: "Querying Existing Query Results",
      }, */
      {
        key: "userguide.querying.parameters",
        href: "/user-guide/querying/query-parameters",
        source: 'querying/query-parameters.md',
        title: "Query Parameters",
      },
      {
        key: "userguide.querying.scheduling",
        href: "/user-guide/querying/scheduling-a-query",
        source: 'querying/scheduling-a-query.md',
        title: "How to schedule a query",
      },
      {
        key: "userguide.querying.favorites",
        href: "/user-guide/querying/favorites-tagging",
        source: 'querying/favorites-tagging.md',
        title: "Favorites & Tagging",
      },
      {
        key: "userguide.querying.download",
        href: "/user-guide/querying/download-query-results",
        source: 'querying/download-query-results.md',
        title: "How To Download / Export Query Results",
      },
      {
        key: "userguide.querying.filters",
        href: "/user-guide/querying/query-filters",
        source: 'querying/query-filters.md',
        title: "Query Filters",
      },
      {
        key: "userguide.querying.snippets",
        href: "/user-guide/querying/query-snippets",
        source: 'querying/query-snippets.md',
        title: "Query Snippets",
      },
    ],
  },
  {
    key: 'userguide.visualizations',
    href: '#',
    title: 'Visualizations',
    children: [
      {
        key: "userguide.visualizations.howto",
        href: "/user-guide/visualizations/visualizations-how-to",
        source: 'visualizations/visualizations-how-to.md',
        title: "Visualizations How To",
      },
      {
        key: "userguide.visualizations.cohort",
        href: "/user-guide/visualizations/cohort-howto",
        source: 'visualizations/cohort-howto.md',
        title: "Cohort Visualizations",
      },
      {
        key: "userguide.visualizations.chart",
        href: "/user-guide/visualizations/chart-visualizations",
        source: 'visualizations/chart-visualizations.md',
        title: "Chart Visualizations",
      },
      {
        key: "userguide.visualizations.numbers",
        href: "/user-guide/visualizations/formatting-numbers",
        source: 'visualizations/formatting-numbers.md',
        title: "Formatting Numbers in Visualizations",
      },
      {
        key: "userguide.visualizations.funnel",
        href: "/user-guide/visualizations/funnel-howto",
        source: 'visualizations/funnel-chart-how-to.md',
        title: "Funnel Visualizations",
      },
      {
        key: "userguide.visualizations.pivot",
        href: "/user-guide/visualizations/pivot-table-visualizations",
        source: 'visualizations/pivot-table-visualizations.md',
        title: "How to make a pivot table",
      },
      {
        key: "userguide.visualizations.table",
        href: "/user-guide/visualizations/table-visualizations",
        source: 'visualizations/table-visualizations.md',
        title: "Table Visualization Options",
      },
      {
        key: "userguide.visualizations.types",
        href: "/user-guide/visualizations/visualization-types",
        source: 'visualizations/visualization-types.md',
        title: "Visualization Types",
      },
      {
        key: "userguide.visualizations.column-format-spec",
        href: "/user-guide/visualizations/column-format-spec",
        source: 'visualizations/column-format-spec.md',
        title: "Column Format Spec",
      },
    ]
  },
  {
    key: 'userguide.dashboards',
    href: '#',
    title: 'Dashboards',
    children: [
      {
        key: "userguide.dashboards.editing",
        href: "/user-guide/dashboards/dashboard-editing",
        source: 'dashboards/dashboard-editing.md',
        title: "Creating and Editing Dashboards",
      },
      {
        key: "userguide.dashboards.favorites",
        href: "/user-guide/dashboards/favorites-tagging",
        source: 'dashboards/favorites-tagging.md',
        title: "Favorites & Tagging",
      },
      {
        key: "userguide.dashboards.sharing",
        href: "/user-guide/dashboards/sharing-dashboards",
        source: 'dashboards/sharing-dashboards.md',
        title: "Sharing and Embedding Dashboards",
      },
    ]
  }
];

export const getPage = async (page='') => {
  if(page===''){
    return '';
  }
  page='/static/user-guide/'+page;
  const resp = await fetch( page );
  const data = await resp.text();
  return data;
};


export default function UserGuide({title, page, selected, opened, renderToc}) {

  const [content, setContent] = useState("");

  if(title === '' || title === undefined){
    title = 'User manual';
  }

  useEffect(() => {
    if(renderToc===true){
      const buildToc = (pages, indent) => {
        let output = '';
        for(const p of pages){
          if(p.href.trim() !== '#'){
            output += `${indent}+ [${p.title}](${p.href})\n`;
          }else{
            output += `${indent}+ ${p.title}\n`;
          }
          if(p?.children && isArray(p.children)){
            output += buildToc(p.children, indent+'  ');
          }
        }
        return output;
      };
      const content = buildToc(sidebarMenu, '');
      setContent(content);
    }
    else{
      async function getPageContent(page) {
        const content = await getPage(page);
        setContent(content);
      }
      getPageContent(page);
    }
  },
  [page, renderToc]);

  return (
    <div className="UserGuide">
      <div className="container">
        <PageHeader
          title={title}
        />
        <Layout>
          <Layout.Sidebar className="m-b-0">
            <Sidebar.Menu items={sidebarMenu} selected={selected} opened={opened} />
          </Layout.Sidebar>
          <Layout.Content>
            <MarkdownPage
            content={content} />
          </Layout.Content>
        </Layout>
      </div>
    </div>
  );
}

UserGuide.propTypes = {
  title: PropTypes.string,
  page: PropTypes.string,
  selected: PropTypes.string,
  renderToc: PropTypes.bool,
};


UserGuide.defaultProps = {
  title: '',
  renderToc: false,
};


routes.register(
  "userguide",
  routeWithUserSession({
    path: "/user-guide",
    title: "User guide",
    render: pageProps => <UserGuide selected="userguide" title="User guide" renderToc={true} />,
  })
);

// const registerMenuRoutes = (menuItems) => {
//   menuItems.forEach((item) => {
//     if(item.href !== '#'){
//       routes.register(
//         item.key,
//         routeWithUserSession({
//           path: item.href,
//           title: item.title,
//           render: pageProps => <Manual selected={item.key} page={item.source || ''} />,
//         })
//       );
//     }

//     // if(item.hasOwnProperty('children')){
//     //   registerMenuRoutes(item.children);
//     // }
//   });
// };

const registerRoutes = (menuItems, openedKeys=[]) => {
  map(menuItems, routeItem => {
    if(routeItem.href !== '#'){
      routes.register(
        routeItem.key,
        routeWithUserSession({
          path: routeItem.href,
          title: routeItem.title,
          render: pageProps => <UserGuide selected={routeItem.key} opened={openedKeys} page={routeItem.source || ''} title={routeItem.title || ''} />,
        })
      );
    }
    if(routeItem.hasOwnProperty('children')){
      let childrenKeys = openedKeys.slice()
      childrenKeys.push(routeItem.key);
      registerRoutes(routeItem.children, childrenKeys);
    }
  });
};

registerRoutes(sidebarMenu);
