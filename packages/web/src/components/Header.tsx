import React, {FC} from "react";
import bannerImage from "../assets/Halloween-costume-contest.png";

type Props = {

}

const Header: React.FC<Props> = ({}) => {
    return (
      <>
        <img src={bannerImage} alt="banner" />
      </>
    );
}

export default Header;