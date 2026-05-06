export default function SocialShare({ title, url }) {
  const shareUrl = url || window.location.href;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title || 'Check this out');

  return (
    <div className="social-share">
      <p>Share this product:</p>
      <div className="social-share__buttons">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noreferrer"
          className="button button--ghost"
        >
          Facebook
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noreferrer"
          className="button button--ghost"
        >
          LinkedIn
        </a>
      </div>
    </div>
  );
}
