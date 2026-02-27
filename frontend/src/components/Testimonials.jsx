import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import user1 from "../assets/testimonials/1.png";
import user2 from "../assets/testimonials/2.png";
import user3 from "../assets/testimonials/3.png";

function TestimonialsData({ t }) {
  const testimonialData = t("testimonials.items", { returnObjects: true });
  const images = [user1, user2, user3];

  const data = testimonialData.map((item, index) => ({
    ...item,
    img: images[index],
  }));
  return (
    <Swiper
      effect={"coverflow"}
      grabCursor={true}
      centeredSlides={true}
      slidesPerView={"auto"}
      coverflowEffect={{
        rotate: 100,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      }}
      pagination={{
        dynamicBullets: true,
      }}
      navigation={true} // 👈 ADD THIS
      modules={[Autoplay, Pagination, Navigation]} // 👈 ADD Navigation
      className="mySwiper"
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
    >
      {data.map((item) => (
        <SwiperSlide key={item.id}>
          <Card
            name={item.name}
            role={item.role}
            description={item.description}
            user={item.img}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

function Card({ name, role, description, user }) {
  return (
    <div className="font-poppins mx-w-xl mx-auto w-3/4 md:w-1/2  border border-primary bg-gradient-primary flex flex-col  rounded-3xl gap-4 p-3 ">
      <div className="flex justify-center items-center ">
        <img src={user} alt="" className="size-12 lg:size-24 " />
      </div>
      <div>
        <h1 className=" text-xl lg:text-2xl text-primary font-semibold text-center">
          {name}
        </h1>
        {/* <p className="text-xs text">{role}</p> */}
      </div>
      <div className="mb-8">
        <p className="text-black lg:text-sm text-xs text-center ">
          {description}
        </p>
      </div>
    </div>
  );
}

import React from "react";
import { useTranslation } from "react-i18next";

const Testimonials = () => {
  const { t } = useTranslation();
  return (
    <>
      {" "}
      <div className="flex justify-center items-center mt-10">
        <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-black text-center p-3">
          {t("testimonials.mainTitle")}{" "}
        </h1>
      </div>
      <div className="flex justify-center items-center mt-10 flex-col">
        <h1 className="text-sm md:text-xl lg:text-2xl font-bold text-primary text-center p-3">
          {t("testimonials.subTitle")}{" "}
        </h1>
        <TestimonialsData t={t} />
      </div>
    </>
  );
};

export default Testimonials;
