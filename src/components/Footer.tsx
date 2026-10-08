
const Footer = () => {
  return (
    <footer className="mt-auto w-full border-t border-green-100 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 text-center sm:px-6 md:flex-row md:gap-8 md:text-left lg:px-8">
        <p className="text-sm leading-6 text-gray-600 sm:text-base">
          বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </p>

        <p className="max-w-xl text-sm leading-6 text-gray-500">
          সকল দাম সম্ভাব্য। বাজারের পরিস্থিতি, স্থান ও সময়ের
          ওপর ভিত্তি করে পরিবর্তিত হয়।
        </p>
      </div>
    </footer>
  );
};

export default Footer;
