import { filter, find, isEmpty, size } from "lodash";
import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Modal from "antd/lib/modal";
import Input from "antd/lib/input";
import List from "antd/lib/list";
import Button from "antd/lib/button";
import { wrap as wrapDialog, DialogPropType } from "@/components/DialogWrapper";
import BigMessage from "@/components/BigMessage";
import LoadingState from "@/components/items-list/components/LoadingState";
import notification from "@/services/notification";
import useSearchResults from "@/lib/hooks/useSearchResults";

import "./SetItemsValueDialog.less";

function ItemsList({ items }) {
  const renderListItem = useCallback(
    item => {
      const { content, className } = renderItem(item);
      return (
        <List.Item
          className={classNames("select-items-list", "w-100", "p-l-10", "p-r-10", className)}>
          {content}
        </List.Item>
      );
    },
    [renderItem, onItemClick]
  );

  return <List size="small" dataSource={items} renderItem={renderListItem} />;
}

ItemsList.propTypes = {
  items: PropTypes.array,
  renderItem: PropTypes.func,
  values: PropTypes.array,
  onValueChange: PropTypes.func,
};

ItemsList.defaultProps = {
  items: [],
  renderItem: () => {},
  values: [],
  onValueChange: () => {},
};

function SetItemsValueDialog({
  dialog,
  dialogTitle,
  items,
  renderItem,
  values,
  width,
  showCount,
  extraFooterContent,
}) {
  const hasResults = items.length > 0;
  // const itemsMap =
  const [saveItems, setSaveItems] = useState(itemsMap);

  const valueChanged = useCallback((item, value) => {
    setSaveItems({})
  });

  const save = useCallback(() => {
    dialog.close(selectedItems).catch(error => {
      if (error) {
        notification.error("Failed to save some of selected items.");
      }
    });
  }, [dialog, selectedItems]);

  return (
    <Modal
      {...dialog.props}
      className="select-items-dialog"
      width={width}
      title={dialogTitle}
      footer={
        <div className="d-flex align-items-center">
          <span className="flex-fill m-r-5" style={{ textAlign: "left", color: "rgba(0, 0, 0, 0.5)" }}>
            {extraFooterContent}
          </span>
          <Button {...dialog.props.cancelButtonProps} onClick={dialog.dismiss}>
            Cancel
          </Button>
          <Button
            {...dialog.props.okButtonProps}
            onClick={save}
            disabled={selectedItems.length === 0 || dialog.props.okButtonProps.disabled}
            type="primary">
            Save
            {showCount && !isEmpty(selectedItems) ? ` (${size(selectedItems)})` : null}
          </Button>
        </div>
      }>

      <div className="d-flex align-items-stretch" style={{ minHeight: "30vh", maxHeight: "50vh" }}>
        <div className="flex-fill scrollbox">
          <ItemsList
            items={items}
            onValueChange=
          />
        </div>
      </div>
    </Modal>
  );
}

SetItemsValueDialog.propTypes = {
  dialog: DialogPropType.isRequired,
  dialogTitle: PropTypes.string,
  items: PropTypes.array.isRequired,
  values: PropTypes.array.isRequired,
  renderItem: PropTypes.func,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  extraFooterContent: PropTypes.node,
  showCount: PropTypes.bool,
};

SetItemsValueDialog.defaultProps = {
  dialogTitle: "Map Items",
  renderItem: (item) => item.name,
  width: "80%",
  extraFooterContent: null,
  showCount: false,
};

export default wrapDialog(SetItemsValueDialog);
