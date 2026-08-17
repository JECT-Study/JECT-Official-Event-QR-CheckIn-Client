import { Icon } from "@jects/jds";

const LINKS = [
  ["공식 웹사이트", "https://ject.kr"],
  ["GitHub", "https://github.com/JECT-Study"],
  ["Instagram", "https://www.instagram.com/ject_official"],
  ["JDS", "https://www.figma.com/community/file/1547190026603503566"],
] as const;

export function CheckinFooter() {
  return (
    <footer className="checkin-footer">
      <nav aria-label="젝트 관련 링크">
        <ul className="checkin-footer__links">
          {LINKS.map(([label, href]) => (
            <li key={label}>
              <a href={href} target="_blank" rel="noreferrer">
                {label}<Icon name="external-link-line" size="2xs" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <p className="checkin-footer__copyright">jectofficial@ject.kr</p>
      <p className="checkin-footer__copyright">© 2026 JECT. All rights reserved.</p>
    </footer>
  );
}
