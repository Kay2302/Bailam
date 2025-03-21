import React from 'react';

function Home() {
  return (
    <section className="page-section bg-primary" id="home">
      <div className="container px-4 px-lg-5">
        <div className="row gx-4 gx-lg-5 justify-content-center">
          <div className="col-lg-8 text-center">
            <h2 className="text-white mt-0">Chúng tôi có mọi thứ bạn cần!</h2>
            <hr className="divider divider-light" />
            <p className="text-white-75 mb-4">Website của chúng tôi cung cấp đầy đủ thông tin và dịch vụ mà bạn đang tìm kiếm. Dễ dàng sử dụng và hoàn toàn miễn phí!</p>
            <a className="btn btn-light btn-xl" href="#tin-tuc">Xem Tin Tức!</a>
          </div>
        </div>
      </div>
      
      <div className="container px-4 px-lg-5 mt-5">
        <h2 className="text-center text-white mt-0">Dịch Vụ Của Chúng Tôi</h2>
        <hr className="divider divider-light" />
        <div className="row gx-4 gx-lg-5">
          <div className="col-lg-3 col-md-6 text-center">
            <div className="mt-5">
              <div className="mb-2"><i className="bi-gem fs-1 text-white"></i></div>
              <h3 className="h4 mb-2 text-white">Dịch Vụ 1</h3>
              <p className="text-white-75 mb-0">Mô tả chi tiết về dịch vụ 1 của chúng tôi!</p>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 text-center">
            <div className="mt-5">
              <div className="mb-2"><i className="bi-laptop fs-1 text-white"></i></div>
              <h3 className="h4 mb-2 text-white">Dịch Vụ 2</h3>
              <p className="text-white-75 mb-0">Mô tả chi tiết về dịch vụ 2 của chúng tôi.</p>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 text-center">
            <div className="mt-5">
              <div className="mb-2"><i className="bi-globe fs-1 text-white"></i></div>
              <h3 className="h4 mb-2 text-white">Dịch Vụ 3</h3>
              <p className="text-white-75 mb-0">Mô tả chi tiết về dịch vụ 3 của chúng tôi!</p>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 text-center">
            <div className="mt-5">
              <div className="mb-2"><i className="bi-heart fs-1 text-white"></i></div>
              <h3 className="h4 mb-2 text-white">Dịch Vụ 4</h3>
              <p className="text-white-75 mb-0">Mô tả chi tiết về dịch vụ 4 của chúng tôi!</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;