import { type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/PostView";

const CreatePostWizard = () => {
  const [chirp, setChirp] = useState("");
  const { user } = useUser();

  const ctx = api.useContext();
  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setChirp("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (err) => {
      const errorMesage = err.data?.zodError?.fieldErrors.content;
      if (errorMesage && errorMesage[0]) {
        toast.error(errorMesage[0]);
      } else {
        toast.error("Failed to post! Please try again later");
      }
    },
  });

  if (!user) return null;
  return (
    <div className="w-full">
      <div className="mb-4 ml-auto w-fit">
        <SignOutButton />
      </div>
      <div className="flex w-full items-center justify-between ">
        <div className="flex w-full items-center gap-4">
          <Image
            src={user.profileImageUrl}
            alt="Profile image"
            className="h-14 w-14 rounded-full"
            width={56}
            height={56}
          />
          <input
            className="w-full grow rounded bg-transparent p-1 px-2 outline-none"
            placeholder="Chirp somethin..."
            value={chirp}
            type="text"
            disabled={isPosting}
            onChange={(e) => setChirp(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (chirp !== "") {
                  mutate({ content: chirp });
                }
              }
            }}
          />
          {chirp !== "" && !isPosting && (
            <button
              onClick={() => mutate({ content: chirp })}
              disabled={isPosting}
            >
              Submit
            </button>
          )}
          {isPosting && (
            <div>
              <LoadingSpinner size={20} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Feed = () => {
  const { data, isLoading } = api.posts.getAll.useQuery();

  if (isLoading) {
    return (
      <div className="mx-auto w-fit">
        <LoadingPage />
      </div>
    );
  }

  if (!data) {
    return <div> No posts yet</div>;
  }

  return (
    <div className="mt-4 ">
      {data?.map((postFull) => (
        <PostView key={postFull.post.id} {...postFull} />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  const { isLoaded, isSignedIn } = useUser();
  // Start fetching posts asap
  api.posts.getAll.useQuery();
  if (!isLoaded) {
    return (
      <div>
        <LoadingPage />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Chirp</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout>
        <div className="flex border-b  border-slate-400  p-4">
          {!isSignedIn ? (
            <div>
              <SignInButton />
            </div>
          ) : (
            <CreatePostWizard />
          )}
        </div>

        <Feed />
      </PageLayout>
    </>
  );
};

export default Home;
