import useWindowSize from "@/hooks/useWindowSize";
import { Box, Typography, createSvgIcon, styled } from "@mui/material";
import React from "react";

interface AboutItemProps {
  title: string;
  description: string;
  imgSrc: string;
  icon: "tooth" | "bucal";
  isReverse: boolean;
}

export const WhiteToothIcon = createSvgIcon(
  <svg viewBox="0 0 51 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M39.6667 0C42.7833 0 45.4514 1.10972 47.6708 3.32917C49.8903 5.54861 51 8.21667 51 11.3333C51 11.8528 50.9646 12.5493 50.8937 13.4229C50.8229 14.2965 50.7167 15.3 50.575 16.4333L46.6792 44.9792C46.4431 46.7736 45.6285 48.2375 44.2354 49.3708C42.8424 50.5042 41.2486 51.0708 39.4542 51.0708C38.3681 51.0708 37.3646 50.8347 36.4437 50.3625C35.5229 49.8903 34.7556 49.2292 34.1417 48.3792L26.5625 37.3292C26.4681 37.1403 26.3146 37.0104 26.1021 36.9396C25.8896 36.8688 25.6653 36.8333 25.4292 36.8333C25.2403 36.8333 24.8625 37.0458 24.2958 37.4708L16.9292 48.1667C16.2681 49.1111 15.4535 49.8312 14.4854 50.3271C13.5174 50.8229 12.4903 51.0708 11.4042 51.0708C9.60972 51.0708 8.02778 50.4924 6.65833 49.3354C5.28889 48.1785 4.48611 46.7028 4.25 44.9083L0.425 16.4333C0.283333 15.3 0.177083 14.2965 0.10625 13.4229C0.0354167 12.5493 0 11.8528 0 11.3333C0 8.21667 1.10972 5.54861 3.32917 3.32917C5.54861 1.10972 8.21667 0 11.3333 0C13.0333 0 14.391 0.224306 15.4062 0.672917C16.4215 1.12153 17.4014 1.60556 18.3458 2.125C19.2903 2.64444 20.2937 3.12847 21.3562 3.57708C22.4187 4.02569 23.8 4.25 25.5 4.25C27.2 4.25 28.5813 4.02569 29.6438 3.57708C30.7063 3.12847 31.7097 2.64444 32.6542 2.125C33.5986 1.60556 34.5903 1.12153 35.6292 0.672917C36.6681 0.224306 38.0139 0 39.6667 0Z"
      fill="#ffffff"
    />
  </svg>,
  "tooth"
);

const ToothIcon = createSvgIcon(
  <svg viewBox="0 0 51 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M39.6667 0C42.7833 0 45.4514 1.10972 47.6708 3.32917C49.8903 5.54861 51 8.21667 51 11.3333C51 11.8528 50.9646 12.5493 50.8937 13.4229C50.8229 14.2965 50.7167 15.3 50.575 16.4333L46.6792 44.9792C46.4431 46.7736 45.6285 48.2375 44.2354 49.3708C42.8424 50.5042 41.2486 51.0708 39.4542 51.0708C38.3681 51.0708 37.3646 50.8347 36.4437 50.3625C35.5229 49.8903 34.7556 49.2292 34.1417 48.3792L26.5625 37.3292C26.4681 37.1403 26.3146 37.0104 26.1021 36.9396C25.8896 36.8688 25.6653 36.8333 25.4292 36.8333C25.2403 36.8333 24.8625 37.0458 24.2958 37.4708L16.9292 48.1667C16.2681 49.1111 15.4535 49.8312 14.4854 50.3271C13.5174 50.8229 12.4903 51.0708 11.4042 51.0708C9.60972 51.0708 8.02778 50.4924 6.65833 49.3354C5.28889 48.1785 4.48611 46.7028 4.25 44.9083L0.425 16.4333C0.283333 15.3 0.177083 14.2965 0.10625 13.4229C0.0354167 12.5493 0 11.8528 0 11.3333C0 8.21667 1.10972 5.54861 3.32917 3.32917C5.54861 1.10972 8.21667 0 11.3333 0C13.0333 0 14.391 0.224306 15.4062 0.672917C16.4215 1.12153 17.4014 1.60556 18.3458 2.125C19.2903 2.64444 20.2937 3.12847 21.3562 3.57708C22.4187 4.02569 23.8 4.25 25.5 4.25C27.2 4.25 28.5813 4.02569 29.6438 3.57708C30.7063 3.12847 31.7097 2.64444 32.6542 2.125C33.5986 1.60556 34.5903 1.12153 35.6292 0.672917C36.6681 0.224306 38.0139 0 39.6667 0Z"
      fill="#00ABEB"
    />
  </svg>,
  "tooth"
);

const BucalIcon = createSvgIcon(
  <svg viewBox="0 0 83 59" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M56.1471 33.1833L56.0969 33.1875V30.7292H56.1471V26.4271C56.1471 21.3357 60.2456 17.2083 65.3015 17.2083C70.3573 17.2083 74.4559 21.3357 74.4559 26.4271V36.875C74.4559 38.9115 72.8165 40.5625 70.7941 40.5625H59.8088C57.7865 40.5625 56.1471 38.9115 56.1471 36.875V33.1833ZM26.8529 30.7292H26.9031V33.1875L26.8529 33.1833V36.875C26.8529 38.9115 25.2135 40.5625 23.1912 40.5625H12.2059C10.1835 40.5625 8.54412 38.9115 8.54412 36.875V26.4271C8.54412 21.3357 12.6427 17.2083 17.6985 17.2083C22.7544 17.2083 26.8529 21.3357 26.8529 26.4271V30.7292ZM50.0441 40.0929L56.3623 44.7202C56.9939 45.1828 57.3676 45.9218 57.3676 46.7083V56.5417C57.3676 57.8994 56.2747 59 54.9265 59C53.5783 59 52.4853 57.8994 52.4853 56.5417V47.9602L49.1062 45.4854C49.6893 44.8323 50.0441 43.9683 50.0441 43.0208V40.0929ZM53.7059 20.9229C51.6545 16.5479 47.2334 13.5208 42.1103 13.5208C36.399 13.5208 31.5603 17.2829 29.9044 22.4805C28.2485 17.2829 23.4098 13.5208 17.6985 13.5208C10.6204 13.5208 4.88235 19.2992 4.88235 26.4271V34.3303C1.96368 32.6301 0 29.4522 0 25.8125V19.6667C0 6.28119 14.2568 0 41.5 0C68.7432 0 83 6.28119 83 19.6667V25.8125C83 29.4522 81.0363 32.6301 78.1177 34.3303V26.4271C78.1177 19.2992 72.3797 13.5208 65.3015 13.5208C60.1783 13.5208 55.7573 16.5479 53.7059 20.9229ZM50.0441 40.0929L42.9358 34.8868C41.8455 34.0883 40.3187 34.3311 39.5257 35.4291C38.7327 36.5271 38.9738 38.0646 40.0642 38.8632L49.1062 45.4854C48.4359 46.2362 47.4639 46.7083 46.3824 46.7083H36.6176C34.5953 46.7083 32.9559 45.0574 32.9559 43.0208V34.4167C32.9559 29.6647 36.7812 25.8125 41.5 25.8125C46.2188 25.8125 50.0441 29.6647 50.0441 34.4167V40.0929Z"
      fill="#00ABEB"
    />
  </svg>,
  "bucal"
);

const AboutItem = (props: AboutItemProps) => {
  const { width } = useWindowSize();

  const ImageMobile = styled("img")`
    width: 90%;
    height: min-content;
    align-self: ${!props.isReverse ? "flex-end" : "flex"};
  `;

  const aboutFont = `${width! > 760 ? (width! / 50) * 1.6 : width! / 20}px`;
  return (
    <AboutTextContainer reversed={props.isReverse}>
      <InnerAbout>
        <Typography
          variant="h3"
          sx={{
            color: "var(--dark-blue)",
            fontSize: aboutFont,
            alignSelf: "flex-start",
            mb: width! > 760 ? "60px" : "16px",
            p: "2rem 4rem 0 4rem",
          }}
        >
          {props.title}
        </Typography>

        {width! <= 760 && <ImageMobile src={props.imgSrc} />}

        <TextAndIcon reversed={false}>
          {props.icon === "tooth" ? (
            <ToothIcon sx={{ fontSize: `${(width! / 50) * 2.5}px` }} />
          ) : (
            <BucalIcon sx={{ fontSize: `${(width! / 50) * 2.5}px` }} />
          )}
          <Description
            fontWeight={500}
            fontSize={`${width! > 760 ? width! / 70 : width! / 40}px`}
          >
            {props.description}
          </Description>
        </TextAndIcon>
      </InnerAbout>

      {width! > 760 && <StyledImage src={props.imgSrc} />}
    </AboutTextContainer>
  );
};

const AboutTextContainer = styled(Box)<{ reversed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: ${({ reversed }) => (reversed ? "row-reverse" : "row")};
  height: max-content;

  @media screen and (max-width: 760px) {
    flex-direction: column;
  }
`;

const InnerAbout = styled(Box)`
  width: 50%;
  height: 100%;
  padding: 2rem 3rem;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  align-self: flex-start;

  @media screen and (max-width: 760px) {
    width: 100%;
    padding: 0;
  }
`;

const TextAndIcon = styled(Box)<{ reversed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: ${({ reversed }) => (reversed ? "row-reverse" : "row")};
  height: 100%;
  width: 90%;
  column-gap: 2rem;

  @media screen and (max-width: 760px) {
    justify-content: center;
    width: 100%;
    padding: 1rem 4rem;
  }
`;

const StyledImage = styled("img")`
  width: 50%;
`;

const Description = styled(Typography)`
  @media screen and (max-width: 760px) {
    width: 80%;
  }
`;

export default AboutItem;
