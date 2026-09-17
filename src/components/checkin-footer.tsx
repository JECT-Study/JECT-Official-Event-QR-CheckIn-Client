import { Icon } from "@jects/jds";
import { textStyles } from "@jects/jds/tokens";

const LINKS = [
  ["공식 웹사이트", "https://ject.kr"],
  ["GitHub", "https://github.com/JECT-Study"],
  ["Instagram", "https://www.instagram.com/ject.official"],
  ["JDS", "https://www.figma.com/community/file/1547190026603503566"],
] as const;

export function CheckinFooter() {
  return (
    <footer className="checkin-footer">
      <nav aria-label="젝트 관련 링크">
        <ul className="checkin-footer__links">
          {LINKS.map(([label, href]) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                style={textStyles.label.sm.bold}
              >
                {label}
                <Icon name="external-link" size="2xs" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <p
        className="checkin-footer__copyright"
        style={textStyles.label.xs.subtle}
      >
        <span>jectofficial@ject.kr</span>
        <span>© 2026 JECT. All rights reserved.</span>
      </p>
    </footer>
  );
}
