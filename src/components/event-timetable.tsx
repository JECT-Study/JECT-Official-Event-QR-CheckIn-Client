import { Table } from "@jects/jds";
import { textStyles } from "@jects/jds/tokens";
import type { EventTimetableRow } from "@/lib/timetable";

export function EventTimetable({ rows }: { rows: EventTimetableRow[] }) {
  if (rows.length === 0) return null;

  return (
    <section
      className="event-timetable"
      aria-labelledby="event-timetable-title"
    >
      <h2 id="event-timetable-title" style={textStyles.title[2]}>
        행사 타임테이블
      </h2>
      <div className="event-timetable__frame">
        <Table.Root
          className="event-timetable__table"
          aria-labelledby="event-timetable-title"
        >
          <Table.Header>
            <Table.HeaderItem width={120}>시간</Table.HeaderItem>
            <Table.HeaderItem hasDivider={false}>내용</Table.HeaderItem>
          </Table.Header>
          <Table.Body>
            {rows.map((row, index) => (
              <Table.Row key={index}>
                <Table.RowItem variant="label">
                  {row.startTime}
                  ~<wbr />
                  {row.endTime}
                </Table.RowItem>
                <Table.RowItem variant="label" hasDivider={false}>
                  {row.schedule}
                </Table.RowItem>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </div>
    </section>
  );
}
