import React from "react";

import "./thememenu.css";

const mode_setting = [
  {
    id: "light",
    name: "Light",
    background: "light-background",
    class: "theme-mode-light",
    logo: "",
  },
  {
    id: "dark",
    name: "Dark",
    background: "dark-background",
    class: "theme-mode-dark",
    logo: "",
  },
];

const color_setting = "";

const ThemeMenu = () => {
  return (
    <div>
      <button className="dropdown__toggle">
        <i className="bx bx-palette"></i>
      </button>
      <div className="theme-menu">
        <h4>Theme setting</h4>
        <button className="theme-menu__close">
          <i className="bx bx-x"></i>
        </button>
        <div className="theme-menu__select">
          <span>Choose mode</span>
          <ul className="mode-list">
            {mode_setting.map((item, index) => (
              <li key={index}>
                <div className={`mode-list__color ${item.background}`}>
                  <i className="bx bx-check"></i>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ThemeMenu;
