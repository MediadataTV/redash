import React, { useState } from "react";
import PropTypes from "prop-types";
import { head, isEmpty, isNull, isUndefined } from "lodash";
// import Mustache from "mustache";
// import nunjucks from "nunjucks"

import HelpTrigger from "@/components/HelpTrigger";
import { Alert as AlertType, Query as QueryType } from "@/components/proptypes";

import AlertService from "@/services/alert";
import notification from "@/services/notification";

import Input from "antd/lib/input";
import Select from "antd/lib/select";
import Modal from "antd/lib/modal";
import Switch from "antd/lib/switch";

import HtmlContent from "@redash/viz/lib/components/HtmlContent";

import "./NotificationTemplate.less";

function normalizeCustomTemplateData(alert, query, columnNames, resultValues) {
  const topValue = !isEmpty(resultValues) ? head(resultValues)[alert.options.column] : null;

  return {
    ALERT_STATUS: "TRIGGERED",
    ALERT_CONDITION: alert.options.op,
    ALERT_THRESHOLD: alert.options.value,
    ALERT_NAME: alert.name,
    ALERT_URL: `${window.location.origin}/alerts/${alert.id}`,
    QUERY_NAME: query.name,
    QUERY_URL: `${window.location.origin}/queries/${query.id}`,
    QUERY_RESULT_VALUE: isNull(topValue) || isUndefined(topValue) ? "UNKNOWN" : topValue,
    QUERY_RESULT_ROWS: resultValues,
    QUERY_RESULT_COLS: columnNames.reduce((obj,item)=>{ obj.push({'name': item, 'friendly_name': item, 'type': 'string'}); return obj;}, []),
  };
}

function templateHasContent(template){
  const templatesWithContent = [2];
  return templatesWithContent.includes(template);
}


function NotificationTemplate({ alert, query, columnNames, resultValues, template, setTemplate, subject, setSubject, body, setBody }) {
  const hasContent = templateHasContent(template);
  const [enabled, setEnabled] = useState(hasContent ? 1 : 0);
  const [showPreview, setShowPreview] = useState(false);
  const [previewSubject, setPreviewSubject] = useState("");
  const [preview, setPreview] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");

  const renderData = normalizeCustomTemplateData(alert, query, columnNames, resultValues);

  const setDefaultTemplateContent = template => {
    switch(template){
      case 1:
        setSubject('{{ALERT_STATUS|alert_status_icon}} {{ALERT_NAME}} - Status: {{ALERT_STATUS}}');
        setBody(`<h3>{{ALERT_NAME}}</h3>

To see full alert query: <a href="{{QUERY_URL}}">{{QUERY_URL}}</a>

<legend>Total rows found: <strong>{{QUERY_RESULT_ROWS|length}}</strong></legend>

{% if QUERY_RESULT_ROWS|length > 0 %}
{{ QUERY_RESULT_ROWS | alert_table }}
{% endif %}`);
        break;
      default:
        setSubject(null);
        setBody(null);
        break;
    }
  }

  const onShowPreview = showPreview => {
    setShowPreview(showPreview)
    showPreview && (AlertService.templateRender({ subject, body, data: renderData })
        .then(tpl => {
          setPreviewSubject(tpl.subject);
          setPreview(tpl.body_plain);
          setPreviewHtml(tpl.body_html);
        })
        .catch(error => {
          notification.error("Failed to render alert template.\n" + error?.response?.data?.error );
          console.error(error?.response?.data);
        })
      );
    }

  const onEnabledChange = template => {
    setTemplate(template);
    if(templateHasContent(template)){
      Modal.confirm({
        title: "Are you sure?",
        content: "Switching to default template will discard your custom template.",
        onOk: () => {
          setSubject(null);
          setBody(null);
          setEnabled(true);
          setShowPreview(false);
        },
        maskClosable: true,
        autoFocusButton: null,
      });
    }
    else{
      setEnabled(false);
      setShowPreview(false);
      setDefaultTemplateContent(template);
    }
  };

  return (
    <div className="alert-template">
      <Select
        value={template}
        onChange={onEnabledChange}
        optionLabelProp="label"
        dropdownMatchSelectWidth={false}
        style={{ width: "fit-content" }}>
        <Select.Option value={0} label="Use default template">
          Default template
        </Select.Option>
        <Select.Option value={1} label="Use results summary template">
          Results summary template
        </Select.Option>
        <Select.Option value={2} label="Use custom template">
          Custom template
        </Select.Option>
      </Select>
      {!!enabled && (
        <div className="alert-custom-template" data-test="AlertCustomTemplate">
          <div className="d-flex align-items-center">
            <h5 className="flex-fill">Subject / Body</h5>
            Preview{" "}
            <Switch size="small" className="alert-template-preview" checked={showPreview} onChange={onShowPreview} />
          </div>
          {/* TODO: consider adding real labels (not clear for sighted users as well) */}
          <Input
            value={showPreview ? previewSubject : subject}
            aria-label="Subject"
            onChange={e => setSubject(e.target.value)}
            disabled={showPreview}
            data-test="CustomSubject"
          />
          <Input.TextArea
            value={showPreview ? preview : body}
            aria-label="Body"
            autoSize={{ minRows: 9 }}
            onChange={e => setBody(e.target.value)}
            disabled={showPreview}
            data-test="CustomBody"
          />
          { showPreview && (
          <HtmlContent className="preview markdown">{previewHtml}</HtmlContent>
          )}
          <HelpTrigger type="ALERT_NOTIF_TEMPLATE_GUIDE" className="f-13">
            <i className="fa fa-question-circle" aria-hidden="true" /> Formatting guide{" "}
            <span className="sr-only">(help)</span>
          </HelpTrigger>
        </div>
      )}
    </div>
  );
}

NotificationTemplate.propTypes = {
  alert: AlertType.isRequired,
  query: QueryType.isRequired,
  columnNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  resultValues: PropTypes.arrayOf(PropTypes.any).isRequired,
  template: PropTypes.number,
  setTemplate: PropTypes.func.isRequired,
  subject: PropTypes.string,
  setSubject: PropTypes.func.isRequired,
  body: PropTypes.string,
  setBody: PropTypes.func.isRequired,
};

NotificationTemplate.defaultProps = {
  subject: "",
  body: "",
};

export default NotificationTemplate;
