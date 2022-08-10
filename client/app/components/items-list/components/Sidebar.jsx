import { isFunction, isString, filter } from "lodash";
import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import Input from "antd/lib/input";
import AntdMenu from "antd/lib/menu";
import Link from "@/components/Link";
import TagsList from "@/components/TagsList";

/*
    SearchInput
 */

export function SearchInput({ placeholder, value, showIcon, onChange, label }) {
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const onInputChange = useCallback(
    event => {
      const newValue = event.target.value;
      setCurrentValue(newValue);
      onChange(newValue);
    },
    [onChange]
  );

  const InputControl = showIcon ? Input.Search : Input;
  return (
    <div className="m-b-10">
      <InputControl
        className="form-control"
        placeholder={placeholder}
        value={currentValue}
        aria-label={label}
        onChange={onInputChange} />
    </div>
  );
}

SearchInput.propTypes = {
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  showIcon: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
};

SearchInput.defaultProps = {
  placeholder: "Search...",
  showIcon: false,
  label: "Search",
};

/*
    Menu
 */

const renderMenuItems = (items) => {
  return items.map(item => {
    if(item.hasOwnProperty('children') && item.children.length > 0){
      return (
//         if(isString(item.icon) && item.icon !== ""){
//           <span className="btn-favorite m-r-5">
//             <i className={item.icon} aria-hidden="true" />
//           </span>
//         }
//         {isFunction(item.icon) && (item.icon(item) || null)}
        <AntdMenu.SubMenu key={item.key} title={item.title} icon={item.icon}>
          {renderMenuItems(item.children)}
        </AntdMenu.SubMenu>
      );
    }else{
      return (
      <AntdMenu.Item key={item.key} className="m-0">
        <Link href={item.href}>
          {isString(item.icon) && item.icon !== "" && (
            <span className="btn-favorite m-r-5">
              <i className={item.icon} aria-hidden="true" />
            </span>
          )}
          {isFunction(item.icon) && (item.icon(item) || null)}
          {item.title}
        </Link>
      </AntdMenu.Item>
      );
    }
  });
};

export function Menu({ items, opened, selected }) {
  items = filter(items, item => (isFunction(item.isAvailable) ? item.isAvailable() : true));
  if (items.length === 0) {
    return null;
  }
  return (
    <div className="m-b-10 tags-list tiled">
      <AntdMenu className="invert-stripe-position" mode="inline" selectable={false} selectedKeys={[selected]} defaultOpenKeys={opened}>
        {renderMenuItems(items)}
      </AntdMenu>
    </div>
  );
}

Menu.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      icon: PropTypes.func, // function to render icon
      isAvailable: PropTypes.func, // return `true` to show item and `false` to hide; if omitted: show item
    })
  ),
  selected: PropTypes.string,
};

Menu.defaultProps = {
  items: [],
  selected: null,
};

/*
    MenuIcon
 */

export function MenuIcon({ icon }) {
  return (
    <span className="btn-favorite m-r-5">
      <i className={icon} aria-hidden="true" />
    </span>
  );
}

MenuIcon.propTypes = {
  icon: PropTypes.string.isRequired,
};

/*
    ProfileImage
 */

export function ProfileImage({ user }) {
  if (!isString(user.profile_image_url) || user.profile_image_url === "") {
    return null;
  }
  return <img src={user.profile_image_url} className="profile__image--sidebar m-r-5" width="13" alt={user.name} />;
}

ProfileImage.propTypes = {
  user: PropTypes.shape({
    profile_image_url: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
};

/*
    Tags
 */

export function Tags({ url, onChange, showUnselectAll }) {
  if (url === "") {
    return null;
  }
  return (
    <div className="m-b-10">
      <TagsList tagsUrl={url} onUpdate={onChange} showUnselectAll={showUnselectAll} />
    </div>
  );
}

Tags.propTypes = {
  url: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  showUnselectAll: PropTypes.bool,
  unselectAllButtonTitle: PropTypes.string,
};
