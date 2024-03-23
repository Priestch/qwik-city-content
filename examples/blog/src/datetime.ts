import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

function toNow(text) {
  return dayjs(text).toNow();
}

export {
  toNow,
}