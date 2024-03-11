import SharedLink from "@/models/sharedLink";

export function getSharedLink(_page: number, _limit: number) {
  return SharedLink.find()
    .sort({ _id: -1 })
    .skip(_page * _limit)
    .limit(_limit);
}

export async function createSharedLink(
  data: { link: string },
  email: string,
) {
  const res = await fetch(
    `https://noembed.com/embed?dataType=json&url=${data.link}`,
  );
  const name = (await res.json()).title;
  return SharedLink.create({
    link: data.link,
    sharedBy: email,
    name: name,
  });
}
