import { useEffect, useRef, useState } from "react";

// @ts-ignore
// import BIRDS from "vanta/dist/vanta.birds.min";
import GLOBE from "vanta/dist/vanta.globe.min";
import * as THREE from "three";

import Link from "next/link";

type Mode = "home" | "privacy policy" | "terms and conditions";

export default function NotSignedInScreen() {
  const [vantaEffect, setVantaEffect] = useState<any>(0);
  const vantaRef = useRef(null);

  const [mode, setMode] = useState<Mode>("home");

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        GLOBE({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          // minHeight: 200.0,
          // minWidth: 200.0,'
          scale: 1.0,
          scaleMobile: 1.0,
          //   backgroundColor: "#FFC0CB",
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div
      className={`flex flex-col min-h-screen max-h-screen overflow-hidden ${
        vantaEffect ? "text-white" : ""
      }`}
      ref={vantaRef}
    >
      {mode === "home" && <Home />}
      {mode === "terms and conditions" && <Terms setMode={setMode} />}
      {mode === "privacy policy" && <PrivacyPolicy setMode={setMode} />}
      {/* PRIVACY POLICY AND TERMS OF CONDITIONS */}
      <div className="py-8 flex justify-center gap-8 z-10">
        <span
          onClick={() => setMode("privacy policy")}
          className="text-lg cursor-pointer"
        >
          Privacy Policy
        </span>
        <span
          onClick={() => setMode("terms and conditions")}
          className="text-lg cursor-pointer"
        >
          Terms And Conditions
        </span>
      </div>
    </div>
  );
}

const Home = () => {
  return (
    <div className="flex-1 flex flex-col justify-center items-center gap-6 z-10">
      <h1 className="text-6xl font-bold">RKStudy</h1>
      <h3 className="text-2xl font-normal text-center">
        Generate Quizzes From PDF Notes
        {/* Boost Your Studies With AI Quizzes, Notes And More! */}
      </h3>
      <div className="flex flex-col gap-4">
        <Link href={`/demo`}>
          <button className="btn btn-primary btn-lg">
            Try The Demo (No Account Required)
          </button>
        </Link>
        <Link href={`/signin`}>
          <button className="w-full btn btn-secondary btn-lg">
            Sign In / Create Account
          </button>
        </Link>
      </div>
    </div>
  );
};

const PrivacyPolicy = ({ setMode }: { setMode: any }) => {
  return (
    <div className="flex-1 flex flex-col pt-10 items-center gap-6 z-10 overflow-y-auto px-10">
      <span
        className="text-lg underline cursor-pointer"
        onClick={() => setMode("home")}
      >
        Go Back
      </span>
      <h1 className="text-6xl font-bold">Privacy Policy</h1>
      <p className="overflow-y-auto py-10">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni rem
        blanditiis harum quidem tempore animi ad. Amet ea est autem maxime dolor
        repellat molestiae inventore aut, laborum unde suscipit nobis beatae
        veritatis animi! Voluptas perspiciatis at voluptatem ab assumenda quae
        earum quibusdam, perferendis magni? Quos natus incidunt dolore odit
        maiores adipisci! Hic, veritatis voluptatibus expedita consequuntur
        repudiandae autem excepturi incidunt accusamus enim numquam velit qui
        facilis non? Ducimus rerum vitae quae a alias laboriosam molestias
        assumenda debitis officiis officia voluptate, placeat totam voluptatibus
        explicabo. Ipsa aperiam id explicabo beatae quasi maiores quae,
        assumenda quibusdam, laudantium labore ipsam praesentium porro itaque
        corporis voluptas officia voluptatem magnam, nihil est aliquid
        perferendis! Eos ut aliquam eveniet quo sint suscipit animi assumenda
        corporis unde, repellendus dicta iure ab, ratione voluptatem. Similique,
        fuga sint? Blanditiis, doloribus autem repudiandae placeat officia eaque
        impedit praesentium sit veritatis voluptates similique soluta dolore
        saepe fugiat nobis rerum qui. Neque necessitatibus illo beatae
        aspernatur nemo sit minima magni aperiam quae atque, modi, cum
        assumenda, repellat at asperiores maxime. Quibusdam ab laboriosam
        dolorem vel ratione reiciendis quam sit distinctio similique, voluptate
        fugiat facilis nam enim sunt saepe obcaecati iure molestiae ipsum, dicta
        vero autem, illo esse minus placeat? Quibusdam perferendis reiciendis
        ipsa dolor autem cumque molestiae, odio saepe, voluptatibus esse officia
        itaque magni. Odit maiores laborum animi laboriosam aliquam, reiciendis,
        aspernatur explicabo rem non magni autem quae ut voluptate expedita
        veniam porro aliquid dolores sed illo, ducimus culpa molestiae eos esse
        eaque? Odio ex assumenda, corrupti asperiores a explicabo quisquam vero
        doloribus incidunt iste nihil, possimus sunt natus maxime provident
        dolores error dolorum dolore dolor totam quia voluptates aperiam eveniet
        fugit. Molestiae repellendus voluptates rem, dolorem temporibus quasi
        debitis ducimus obcaecati ad fugiat, error voluptas quo, hic magni
        assumenda? Rerum consequatur, facilis esse beatae a asperiores maiores
        quasi optio enim culpa minima, nesciunt porro vitae et autem laboriosam.
        Rerum perspiciatis nisi iure ad, dolorum, voluptas nesciunt, suscipit ex
        quaerat possimus expedita ipsam! Eos necessitatibus eius odio eveniet,
        inventore itaque ex officia adipisci harum dignissimos reiciendis. Enim
        ea deserunt, quas adipisci quae, alias omnis nam voluptatum
        necessitatibus corrupti, assumenda ducimus eaque mollitia et iure? Minus
        cum expedita iusto velit illo tenetur suscipit possimus voluptate
        molestiae ut quae, nostrum ullam blanditiis maxime delectus cumque
        reprehenderit sunt laborum excepturi reiciendis quidem fuga deserunt
        ipsa obcaecati. Quibusdam voluptates reiciendis repellat! Sunt corporis
        impedit ut labore incidunt iusto harum, sequi placeat molestias! Natus
        eos praesentium veniam quos dignissimos saepe ad est perspiciatis
        consequatur magnam eius, nesciunt quidem, libero numquam distinctio
        voluptatum dolorem soluta optio provident harum cupiditate accusamus
        repellendus. Recusandae non, molestias ullam qui fugit ipsam sed numquam
        eveniet ut rem, iste quibusdam tenetur magni ducimus similique
        consequatur vero doloribus minima perspiciatis? Id, nesciunt placeat?
        Nemo nisi maiores sit dignissimos esse, vitae assumenda dolorum deleniti
        ipsum cum delectus est quis inventore animi exercitationem enim?
        Sapiente saepe, eius quidem sint adipisci eligendi? Suscipit dolorem
        aperiam adipisci eveniet! Ex nesciunt vero, magni officia maiores, hic
        delectus unde, enim nulla doloremque eum aliquam praesentium nihil
        repellat? Placeat rem nam error magni, expedita tempora? Numquam
        praesentium quas mollitia. Officia eius, velit, quae expedita in odit,
        reiciendis numquam eos recusandae nulla odio asperiores aut ratione.
        Atque ex placeat repellendus dignissimos nulla itaque officia commodi
        illum dolorem porro illo distinctio iste odio quae eius, tempora
        repellat perspiciatis sunt accusantium labore ea doloribus! Deleniti,
        quo? Nihil distinctio deleniti sapiente minima unde! Officia quos
        assumenda facere harum praesentium. Nulla ipsum voluptatum corrupti esse
        natus quisquam illum voluptates aliquid? Amet ipsa sint quis laborum
        commodi, eum hic officiis veritatis dolor natus deleniti debitis ullam
        quo, tempora aspernatur nisi mollitia sapiente quas ipsum porro itaque
        nobis, maxime ipsam. Accusantium a autem similique consequatur dolor
        tempore vero magni quisquam, voluptas suscipit temporibus odio id
        eligendi dolores. Earum harum laborum quo, accusantium modi similique.
        Recusandae aliquid at deserunt debitis laborum aspernatur iure quisquam
        corporis corrupti expedita amet neque, sapiente hic cum saepe a porro
        dolor est architecto eum. Aliquam ex esse incidunt vero, sit non
        pariatur porro a est ab ullam nesciunt hic dicta cupiditate libero
        facere minus. Vitae explicabo repellendus consequatur vel possimus
        deleniti, voluptatibus est eaque sint hic suscipit aut officiis eveniet
        iusto ex necessitatibus nemo aperiam corporis sit molestias.
        Reprehenderit iure ad vero praesentium eaque harum accusamus laudantium
        illo assumenda a! Fuga blanditiis est vitae optio eum et suscipit culpa
        dolorem amet voluptatum quas, adipisci a quibusdam quidem cumque rerum
        quasi asperiores, dicta deleniti assumenda. Quia voluptatibus rerum
        repellat quo magni illum expedita maiores? Enim, perferendis? Quas
        aperiam maxime repellat quasi, voluptates cupiditate magnam dolores
        incidunt dolore minus facere suscipit provident doloremque nam beatae
        asperiores placeat obcaecati non officiis illo fugiat dolor fugit
        molestias ex? Illo nulla cupiditate aperiam nostrum aliquam officiis
        eligendi laborum tempore aliquid odit veniam sequi provident iste quae
        maxime dolorem hic explicabo, voluptatum incidunt itaque eveniet non!
        Veritatis minima fugit, nobis repudiandae incidunt asperiores mollitia
        necessitatibus commodi maxime earum qui alias, accusantium explicabo
        corporis! Quo illo, sunt ullam blanditiis impedit minima doloremque
        sapiente, aspernatur repudiandae sequi id, veritatis quas autem iure
        dolorum. Blanditiis, quae cum harum animi dolores corporis deleniti
        provident impedit delectus repellendus placeat beatae adipisci,
        quibusdam alias quos ab nesciunt atque consequatur nemo ea architecto
        vero? Harum nisi, quod tempora, accusantium nam id minima debitis
        ducimus dolores possimus aperiam velit perspiciatis consectetur libero
        alias neque, excepturi ratione. Quae odio velit reiciendis optio. Nihil
        nesciunt sint non placeat obcaecati veritatis aperiam praesentium
        voluptate neque quae nulla architecto debitis, nostrum illum facere
        recusandae labore error, ullam corporis sed soluta laudantium.
        Reprehenderit laboriosam, ut vel adipisci modi consequuntur veritatis
        incidunt? Rerum similique temporibus corrupti mollitia nisi quos esse
        vero illo, quaerat voluptates dolorem deserunt iure quis est. At
        perferendis, nostrum similique cumque beatae a sunt odit accusamus
        architecto? Ducimus quibusdam doloremque vitae eligendi omnis sed nulla
        numquam, non quae eius fugit dolorem ipsa unde molestiae incidunt
        quaerat! Rem, perspiciatis reiciendis cupiditate sed eos, harum vel
        voluptates animi natus architecto fugit molestiae suscipit labore et
        facere hic quaerat illum alias ipsa beatae mollitia ducimus eligendi
        eveniet? Cupiditate illum sequi, culpa ut id quaerat.
      </p>
    </div>
  );
};

const Terms = ({ setMode }: { setMode: any }) => {
  return (
    <div className="flex-1 flex flex-col pt-10 items-center gap-6 z-10 overflow-y-auto px-10">
      <span
        className="text-lg underline cursor-pointer"
        onClick={() => setMode("home")}
      >
        Go Back
      </span>
      <h1 className="text-6xl font-bold">Terms And Conditions</h1>
      <p className="overflow-y-auto py-10">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni rem
        blanditiis harum quidem tempore animi ad. Amet ea est autem maxime dolor
        repellat molestiae inventore aut, laborum unde suscipit nobis beatae
        veritatis animi! Voluptas perspiciatis at voluptatem ab assumenda quae
        earum quibusdam, perferendis magni? Quos natus incidunt dolore odit
        maiores adipisci! Hic, veritatis voluptatibus expedita consequuntur
        repudiandae autem excepturi incidunt accusamus enim numquam velit qui
        facilis non? Ducimus rerum vitae quae a alias laboriosam molestias
        assumenda debitis officiis officia voluptate, placeat totam voluptatibus
        explicabo. Ipsa aperiam id explicabo beatae quasi maiores quae,
        assumenda quibusdam, laudantium labore ipsam praesentium porro itaque
        corporis voluptas officia voluptatem magnam, nihil est aliquid
        perferendis! Eos ut aliquam eveniet quo sint suscipit animi assumenda
        corporis unde, repellendus dicta iure ab, ratione voluptatem. Similique,
        fuga sint? Blanditiis, doloribus autem repudiandae placeat officia eaque
        impedit praesentium sit veritatis voluptates similique soluta dolore
        saepe fugiat nobis rerum qui. Neque necessitatibus illo beatae
        aspernatur nemo sit minima magni aperiam quae atque, modi, cum
        assumenda, repellat at asperiores maxime. Quibusdam ab laboriosam
        dolorem vel ratione reiciendis quam sit distinctio similique, voluptate
        fugiat facilis nam enim sunt saepe obcaecati iure molestiae ipsum, dicta
        vero autem, illo esse minus placeat? Quibusdam perferendis reiciendis
        ipsa dolor autem cumque molestiae, odio saepe, voluptatibus esse officia
        itaque magni. Odit maiores laborum animi laboriosam aliquam, reiciendis,
        aspernatur explicabo rem non magni autem quae ut voluptate expedita
        veniam porro aliquid dolores sed illo, ducimus culpa molestiae eos esse
        eaque? Odio ex assumenda, corrupti asperiores a explicabo quisquam vero
        doloribus incidunt iste nihil, possimus sunt natus maxime provident
        dolores error dolorum dolore dolor totam quia voluptates aperiam eveniet
        fugit. Molestiae repellendus voluptates rem, dolorem temporibus quasi
        debitis ducimus obcaecati ad fugiat, error voluptas quo, hic magni
        assumenda? Rerum consequatur, facilis esse beatae a asperiores maiores
        quasi optio enim culpa minima, nesciunt porro vitae et autem laboriosam.
        Rerum perspiciatis nisi iure ad, dolorum, voluptas nesciunt, suscipit ex
        quaerat possimus expedita ipsam! Eos necessitatibus eius odio eveniet,
        inventore itaque ex officia adipisci harum dignissimos reiciendis. Enim
        ea deserunt, quas adipisci quae, alias omnis nam voluptatum
        necessitatibus corrupti, assumenda ducimus eaque mollitia et iure? Minus
        cum expedita iusto velit illo tenetur suscipit possimus voluptate
        molestiae ut quae, nostrum ullam blanditiis maxime delectus cumque
        reprehenderit sunt laborum excepturi reiciendis quidem fuga deserunt
        ipsa obcaecati. Quibusdam voluptates reiciendis repellat! Sunt corporis
        impedit ut labore incidunt iusto harum, sequi placeat molestias! Natus
        eos praesentium veniam quos dignissimos saepe ad est perspiciatis
        consequatur magnam eius, nesciunt quidem, libero numquam distinctio
        voluptatum dolorem soluta optio provident harum cupiditate accusamus
        repellendus. Recusandae non, molestias ullam qui fugit ipsam sed numquam
        eveniet ut rem, iste quibusdam tenetur magni ducimus similique
        consequatur vero doloribus minima perspiciatis? Id, nesciunt placeat?
        Nemo nisi maiores sit dignissimos esse, vitae assumenda dolorum deleniti
        ipsum cum delectus est quis inventore animi exercitationem enim?
        Sapiente saepe, eius quidem sint adipisci eligendi? Suscipit dolorem
        aperiam adipisci eveniet! Ex nesciunt vero, magni officia maiores, hic
        delectus unde, enim nulla doloremque eum aliquam praesentium nihil
        repellat? Placeat rem nam error magni, expedita tempora? Numquam
        praesentium quas mollitia. Officia eius, velit, quae expedita in odit,
        reiciendis numquam eos recusandae nulla odio asperiores aut ratione.
        Atque ex placeat repellendus dignissimos nulla itaque officia commodi
        illum dolorem porro illo distinctio iste odio quae eius, tempora
        repellat perspiciatis sunt accusantium labore ea doloribus! Deleniti,
        quo? Nihil distinctio deleniti sapiente minima unde! Officia quos
        assumenda facere harum praesentium. Nulla ipsum voluptatum corrupti esse
        natus quisquam illum voluptates aliquid? Amet ipsa sint quis laborum
        commodi, eum hic officiis veritatis dolor natus deleniti debitis ullam
        quo, tempora aspernatur nisi mollitia sapiente quas ipsum porro itaque
        nobis, maxime ipsam. Accusantium a autem similique consequatur dolor
        tempore vero magni quisquam, voluptas suscipit temporibus odio id
        eligendi dolores. Earum harum laborum quo, accusantium modi similique.
        Recusandae aliquid at deserunt debitis laborum aspernatur iure quisquam
        corporis corrupti expedita amet neque, sapiente hic cum saepe a porro
        dolor est architecto eum. Aliquam ex esse incidunt vero, sit non
        pariatur porro a est ab ullam nesciunt hic dicta cupiditate libero
        facere minus. Vitae explicabo repellendus consequatur vel possimus
        deleniti, voluptatibus est eaque sint hic suscipit aut officiis eveniet
        iusto ex necessitatibus nemo aperiam corporis sit molestias.
        Reprehenderit iure ad vero praesentium eaque harum accusamus laudantium
        illo assumenda a! Fuga blanditiis est vitae optio eum et suscipit culpa
        dolorem amet voluptatum quas, adipisci a quibusdam quidem cumque rerum
        quasi asperiores, dicta deleniti assumenda. Quia voluptatibus rerum
        repellat quo magni illum expedita maiores? Enim, perferendis? Quas
        aperiam maxime repellat quasi, voluptates cupiditate magnam dolores
        incidunt dolore minus facere suscipit provident doloremque nam beatae
        asperiores placeat obcaecati non officiis illo fugiat dolor fugit
        molestias ex? Illo nulla cupiditate aperiam nostrum aliquam officiis
        eligendi laborum tempore aliquid odit veniam sequi provident iste quae
        maxime dolorem hic explicabo, voluptatum incidunt itaque eveniet non!
        Veritatis minima fugit, nobis repudiandae incidunt asperiores mollitia
        necessitatibus commodi maxime earum qui alias, accusantium explicabo
        corporis! Quo illo, sunt ullam blanditiis impedit minima doloremque
        sapiente, aspernatur repudiandae sequi id, veritatis quas autem iure
        dolorum. Blanditiis, quae cum harum animi dolores corporis deleniti
        provident impedit delectus repellendus placeat beatae adipisci,
        quibusdam alias quos ab nesciunt atque consequatur nemo ea architecto
        vero? Harum nisi, quod tempora, accusantium nam id minima debitis
        ducimus dolores possimus aperiam velit perspiciatis consectetur libero
        alias neque, excepturi ratione. Quae odio velit reiciendis optio. Nihil
        nesciunt sint non placeat obcaecati veritatis aperiam praesentium
        voluptate neque quae nulla architecto debitis, nostrum illum facere
        recusandae labore error, ullam corporis sed soluta laudantium.
        Reprehenderit laboriosam, ut vel adipisci modi consequuntur veritatis
        incidunt? Rerum similique temporibus corrupti mollitia nisi quos esse
        vero illo, quaerat voluptates dolorem deserunt iure quis est. At
        perferendis, nostrum similique cumque beatae a sunt odit accusamus
        architecto? Ducimus quibusdam doloremque vitae eligendi omnis sed nulla
        numquam, non quae eius fugit dolorem ipsa unde molestiae incidunt
        quaerat! Rem, perspiciatis reiciendis cupiditate sed eos, harum vel
        voluptates animi natus architecto fugit molestiae suscipit labore et
        facere hic quaerat illum alias ipsa beatae mollitia ducimus eligendi
        eveniet? Cupiditate illum sequi, culpa ut id quaerat.
      </p>
    </div>
  );
};
