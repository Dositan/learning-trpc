import { IoLogoGithub, IoLogoLinkedin, IoLogoTwitter } from 'react-icons/io5';

const Footer = () => {
  const style = { width: 24, height: 24 };
  return (
    <footer className="my-4 max-w-[60ch] px-4 py-2 mx-auto gap-4 flex-col sm:flex-row flex items-center justify-between">
      <p>made with ❤️ by Dastan Ozgeldi</p>
      <div className="flex gap-4 items-center">
        {/* Twitter */}
        <a href="https://twitter.com/dastanozgeldi/">
          <IoLogoTwitter style={style} />
        </a>
        <a href="https://linkedin.com/in/dastanozgeldi/">
          <IoLogoLinkedin style={style} />
        </a>
        <a href="https://github.com/dastanozgeldi/">
          <IoLogoGithub style={style} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
