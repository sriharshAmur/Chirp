import type { RouterOutputs } from "~/utils/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";

dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
export const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div className="flex   gap-4 border-b border-slate-400 px-4 py-4">
      <Link href={`/@${author.username}`}>
        <Image
          src={author.profileImageUrl}
          alt="Profile image"
          className="h-14 w-14 rounded-full"
          width={56}
          height={56}
        />
      </Link>
      <div className="flex flex-col">
        <div className="flex gap-1  text-slate-300">
          <Link href={`/@${author.username}`}>
            <h2 className="">@{author.username}</h2>
          </Link>
          <Link href={`/post/${post.id}}`}>
            <div className="font-thin">
              · {`   ` + dayjs(post.createdAt).fromNow()}
            </div>
          </Link>
        </div>
        <Link href={`/post/${post.id}}`}>
          <p className="text-2xl">{post.content}</p>
        </Link>
      </div>
    </div>
  );
};
