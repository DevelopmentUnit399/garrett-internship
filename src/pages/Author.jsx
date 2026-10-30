import React, { useEffect, useRef, useState } from "react";
import AuthorBanner from "../images/author_banner.jpg";
import AuthorItems from "../components/author/AuthorItems";
import AuthorAPI, { useAuthor } from "../components/author/AuthorAPI";
import AuthorImage from "../images/author_thumbnail.jpg";
import Skeleton from "../components/UI/Skeleton";

const AuthorContent = () => {
  const { author, loading, error } = useAuthor();
  const [isFollowing, setIsFollowing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(null);
  const copyTimeoutRef = useRef(null);

  useEffect(() => {
    return () => window.clearTimeout(copyTimeoutRef.current);
  }, []);

  useEffect(() => {
    setIsFollowing(false);
  }, [author?.authorId]);

  const handleCopyAddress = async () => {
    if (!author?.address) return;

    setCopyError(null);
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard access is unavailable in this browser.");
      }

      await navigator.clipboard.writeText(author.address);
      setCopied(true);
      window.clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = window.setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch (err) {
      setCopied(false);
      setCopyError(err.message);
    }
  };

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        <section
          id="profile_banner"
          aria-label="section"
          className="text-light"
          data-bgimage="url(images/author_banner.jpg) top"
          style={{ background: `url(${AuthorBanner}) top` }}
        ></section>

        <section aria-label="section">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="d_profile de-flex">
                  <div className="de-flex-col">
                    <div className="profile_avatar">
                      {loading ? (
                        <Skeleton
                          width="150px"
                          height="150px"
                          borderRadius="50%"
                        />
                      ) : (
                        <>
                          <img
                            src={author?.authorImage || AuthorImage}
                            alt={author?.authorName || "Author"}
                          />
                          {author && <i className="fa fa-check"></i>}
                        </>
                      )}
                      <div className="profile_name">
                        <h4>
                          {loading ? (
                            <>
                              <Skeleton width="190px" height="24px" />
                              <span className="profile_username">
                                <Skeleton width="120px" height="16px" />
                              </span>
                              <span className="profile_wallet">
                                <Skeleton width="200px" height="16px" />
                              </span>
                            </>
                          ) : (
                            <>
                              {author?.authorName}
                              <span className="profile_username">
                                {author?.tag ? `@${author.tag}` : ""}
                              </span>
                              <span id="wallet" className="profile_wallet">
                                {author?.address}
                              </span>
                              <button
                                id="btn_copy"
                                type="button"
                                title="Copy author address"
                                onClick={handleCopyAddress}
                                disabled={!author?.address}
                              >
                                {copied ? "Copied to Clipboard" : "Copy"}
                              </button>
                            </>
                          )}
                        </h4>
                        {copyError && (
                          <div role="alert">{copyError}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="profile_follow de-flex">
                    <div className="de-flex-col">
                      {loading ? (
                        <>
                          <div className="profile_follower">
                            <Skeleton width="90px" height="16px" />
                          </div>
                          <Skeleton width="80px" height="40px" borderRadius="4px" />
                        </>
                      ) : (
                        <>
                          <div className="profile_follower">
                            {(author?.followers ?? 0) + (isFollowing ? 1 : 0)} followers
                          </div>
                          <button
                            type="button"
                            className="btn-main"
                            onClick={() => setIsFollowing((following) => !following)}
                            disabled={!author}
                          >
                            {isFollowing ? "Unfollow" : "Follow"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="col-md-12" role="alert">
                  Could not load author: {error}
                </div>
              )}

              <div className="col-md-12">
                <div className="de_tab tab_simple">
                  <AuthorItems />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const Author = () => (
  <AuthorAPI>
    <AuthorContent />
  </AuthorAPI>
);

export default Author;
