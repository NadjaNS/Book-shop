window.onload = () => {
  // 1 postavljamo listener load na ucitavanje  prozora

  pisci = []; //28 deklarisemo prazan niz pisci
  zanrovi = []; //35 DEKLARISEMO PRAZAN NIZ ZA ZANROVE

  const stanje = document.getElementsByClassName("stanje"); // 56 postavljamo listener na radio buttone za dostpunost knjige

  for (let i = 0; i < stanje.length; i++) {//57 postavljamo iteracijom kroz dobijeni niz listenere

      stanje[i].addEventListener("change", filterChanged); //58 na dogadjaj change, pozivamo filterChanged
  }

  document.getElementById("sort").addEventListener("change", filterChanged);//69 postavljamo listener dogadjaj change i zovemo filterChanged
  document.getElementById("pretraga").addEventListener("keyup", filterChanged); //64 postavljamo listener na dogadjaj
                                                                                //keyup i pozivamo funkciu filterChanged

  dohvatiPodatke("zanrovi", ispisiZanrove); //12 pozivamo dohvati podatke i prosledjujemp joj naziv json fajla
  // i funkciju ispisiZanrove koja se mapira na callback
  function dohvatiPodatke(file, callback) {
    //2 kreiramo funkciju kojom cemo da preuzmemo sadrzaj json fajlova, prosledjujemo joj naziv fajla koji dohvatamo
    //i prosledjujemo joj funkciju kao parametar... ta funkcija ce sluziti za ispis JSON-a u HTML

    let zahtev = new XMLHttpRequest(); //3 kreiramo objekat kroz koji saljemo zahtev
    zahtev.onreadystatechange = function () {
      //4 zovemo metodu onreadystatechange i kreiramo call b. funk. Ova metoda simulira eventListener za readyState objekta

      if (this.readyState == 4 && this.status == 200) {
        //5 ipitujemo rady state i status, ukoliko zadovoljava uslov pozivamo callback funckiju, odnosno
        //prosledjenu funkciju i toj funkciji prosledjujemo kao parametar odgovor servera. (responseText)
        //s obzirom da se odgovor nalazi u stringu, pasiramo taj string u objekat, kako bismo mogli da vrsimo manipulaciju nad njim
       
        callback(JSON.parse(this.responseText)); //6 kreiramo funkciju kojoj prosledjujemo sadrzaj jsona fajla koji smo dobili
      }
      if (this.status >= 400) {
        //7 definisemo gresku, ukoliko je status servera veci od 400
        var greska = new Error("Request failed:" + zahtev.statusText);
        console.log(greska);
      }
    };
    zahtev.open("GET", "assets/data/" + file + ".json"); //8 otvaramo konekciju
    zahtev.send(); // 9 saljemo zahtev
  }

  function ispisiZanrove(data) {
    //10 kreiramo funkciju za ispis
    // console.log(data) // 11 provera sadrzaja za ispis

    let html = ""; //13 kreiramo promenljivu za ispis
    zanrovi = data; //36  DODELJUJEMO VREDNOST NIZU ZANROVI
    data.forEach(zanr => {
      //14 ispisujemo svaki element na ekran, tako sto vrsimo konkatenaciju za svaki
      html += `<li class="list-group-item">
         <input type="checkbox" value="${zanr.id}" class="zanr" name="zanrovi"/>${zanr.naziv}
      </li>`;
    });
    document.getElementById("zanrovi").innerHTML = html; //15 innerujemo promenljivu html u div sa id="zanrovi" TEST
    const check = document.getElementsByClassName("zanr"); //51.1 postavljamo listener na sve checkboxove za zanrove
    for (let i = 0; i < check.length; i++) {
        check[i].addEventListener("change", filterChanged);
    }
    dohvatiPodatke("pisci", prikaziPisce); //16 pozivamo ponovo funckiju dohvati podatke, koji sada prima
    //naziv json fajla pisci, i prosledjuje funckiju prikaziPisce
    //koju kreiramo u nastavku koda
  }

  function prikaziPisce(data) {// 17 kreiramo funkciju prikazi pisce
    pisci = data; // 29 dodeljujemo vrednost prethodno deklarisnom nizu
    let html = ""; // 18 kreiramo promenljivu za ispis
    data.forEach(pisac => {
      //19 konkateniramo vrednosti za svaki element niza posebno
      html += `<li class="list-group-item">
            <input type="checkbox" value="${pisac.id}" class="pisac" name="pisci" /> ${pisac.ime}  ${pisac.prezime}
         </li>`;
    });

    document.getElementById("pisci").innerHTML = html; //20 inerujemo promenljivu html u div sa id=pisci

    const check = document.getElementsByClassName("pisac"); //***39. dohvatamo sve checkbox elemente sa klasom pisac
    for (let i = 0; i < check.length; i++) {
      //***40 postavljamo listenere, tako sto iteriramo kroz niz checkboxova
      check[i].addEventListener("change", filterChanged); //***41 i cekamo dogadjaj change
      //***funkcija filterChanged poziva originalne podatke
    }
    dohvatiPodatke("knjige", prikaziKnjige); // 21 pozivamo dohvatiPodatke, prosledjujemo naziv fajla knjige,
    //i prosledjujemo funkciju prikaziKnjige
  }

  function prikaziKnjige(data) {
    data = pisacFilter(data); // 43 provlacimo JSON kroz prvi filter i kreiramo pisacFilter
    data = zanroviFilter(data); // 52 PROVLACIMO JSON KROZ DRUGI FILTER...KREIRAMO FUNKCIJU
    data = stanjeFilter(data);  //56 provlacimo JSON kroz treci filter i kreiramo funkciju
    data = searchFilter(data);  //64 provlacimo json kroz cetvrti filter za pretragu i kreiramo funkciju
    data = sort(data);          //68 provlacimo json kroz peti filter za sortiranje i kreiramo funkciju

    let html = ""; // 22 kreiramo promenljivu za ispis

    data.forEach(knjiga => {
      // 23 dinamicki ispisujemo svaki element

      html += `<div class="col-lg-4 col-md-6 mb-4">
<div class="card h-100">
  <a href="#"><img class="card-img-top" src="assets/img/${
    knjiga.slika.src
  }" alt="${knjiga.slika.alt}"></a>
  <div class="card-body">
    <h4 class="card-title">
      <a href="#">${knjiga.naslov}a</a>
    </h4>
    <h6>${dohvatiPisca(knjiga.pisacID)}</h6>
    <h5>$${knjiga.price.novaCena}</h5>
     ${knjiga.price.staraCena ? "<s>$" + knjiga.price.staraCena + "</s>" : ""}
    <p style="color: blue;">
    ${knjiga.naStanju ? "Knjiga je na stanju" : "Knjiga nije na stanju"}
    </p>
    <p class="card-text" id="categories">
       ${dohvatiZanrove(knjiga.zanrovi)}
    </p>
  </div>
</div>
</div>`; // 24 za ispis pisca i zanrova moramo da kreiramo posebne funkcije iz razloga sto su knjige,zanrovi i pisci
      //medjusobno povezani IDj-jem // za staru cenu pisemo ternani if  // za knjigu na stanju pisemo ternani if
    });

    if (!data.length) {
      //25 postavljamo uslov, i proveravamo da li je data prazan
      html = "Nema rezultata!";
    }

    document.getElementById("knjige").innerHTML = html; //26 ako jeste ispisujemo da nema podataka
  }
  function dohvatiPisca(id) {
    //27 kreiramo dohvati pisca, kome cemo proslediti id na osnovu kojeg ce odrediti pisca
    // moramo da deklarisemo globalni niz i ta u njega smestimo pisce dohvace kroz 
    //funkciju prikaziPisce
    // na vrhu dokumenta deklarisemo prazan niz pisci
    let imePisca = pisci.filter((pisac) => pisac.id == id)[0].ime;
    //30. kreiramo promenljivu u koju cemo smestiti ime pisca
    // filtriramo niz pisci
    //31 isto radimo i za prezime
    let prezimePisca = pisci.filter((pisac) => pisac.id == id)[0].prezime;

    return imePisca + " " + prezimePisca; // 32 zatim vracamo vrednosti za ime i prezime pisca
  }
  function dohvatiZanrove(nizZ) {
    //33 kreiramo dohvatiZanrove i prosledjujemo niz zanrova
    //34 MORAMO PONOVO DA KREIRAMO GLOBALNU PROMENLJIVU. OVAJ PUT ZANROVI, KAKO BI NAM BIO DOSTUPAN TAJ NIZ U OVOJ FUNKCIJI
    //deklarisemo prazan niz zanrovi na vrhu dokumenta, i dodeljujemo im vrednost u finkciji ispisiZanrove
    let html = ""; //37 KREIRAMO PRAZAN STRING KAKO BISMO VRSILI KONKATENACIJU i kroz taj string na kraju vatili vrednost
    let zanroviKnjiga = zanrovi.filter((elem) => nizZ.includes(elem.id)); // 38 FILTEROM DODELJUJEMO VREDNOST NOVOM NIZU
    console.log(zanroviKnjiga); //
    for (let i in zanroviKnjiga) {
      html += zanroviKnjiga[i].naziv;
      if (i != zanroviKnjiga.length - 1) { // ako je dosao do poslednjeg elementa nece stavljati zarez
        html += ", ";
      }
    }
    return html;
  }


  
  //----------kraj prvog dela zadatka
  //DRUGI DEO ZADATKA [POTREBNO JE POSTAVITI FILTERE U FUNKCIJU]
  //KREIRAMO FILTERCHANGE FUNKCIJU, KOJA CE DA ZOVE STALNO PRIKAZI KNJIGE I DA JOJ PROSLEDJUJE ORIGINALNI JSON SA KNJIGAMA,
  //A U OKVIRU FUNKCIJE PRIKAZI KNJIGE PRE RENDEROVANJA PROVLACITI ORIGINALNI JSON KROZ SVE FUNKCIJE KOJE NAM SLUZE ZA FILTRIRANJE
  
  function filterChanged() {
    //***42 kreiramo funkciju filterChanged [poziva originalni asinhroni poziv, i uvek ce imati originalni JSON fajl]
    //tako sto pozivamo dohvatiPodatke (prosledjujemo knjige, i prikaziKnjige)
    dohvatiPodatke("knjige", prikaziKnjige); 
    //43 zatim, u okviru prikaziKnjige, prosledjeni JSON originalni fajl, provlacimo kroz prvi filter (pisacFilter)
    //odnosno, kreiramo promenljivu, koja ce biti jednaka rezultatu funkcije pisacFilter
  }

  //***38 postavljamo listenere na dom elemente kojima vrsimo filtriranje
  //***38.1 postaviti listener u okviru funkcije prikaziPisce, nakon sto su renderovani check boxovi
  function pisacFilter(data) { // 45 kreiramo pisac filter
    let niz = []; // 46 kreiramo prazan niz, koji ce ciniti vrednosti cekiranih polja
    let chekirani = document.querySelectorAll(".pisac:checked"); //47 hvatamo sve cekirane elemente (css selektorom )
    chekirani.forEach(function (elem) { //48 iteriramo kroz dobijeni niz cekirani, i value svakog elementa ubacujemo u niz
      niz.push(parseInt(elem.value));
    });

    if (niz.length != 0) {  //49 postavljamo logicku proveru, da li imamo elemenata u nizu, ukoliko imamo
      return data.filter((x) => niz.includes(x.pisacID)); // filtriramo prosledjen JSON i returnujemo
    }
    return data; //50 u suprotnom vracamo ne filtrirani niz  TEST
  }
  

  function zanroviFilter(data) { //51 RADIMO ISTU STVAR KAO I ZA PISACFILTER. KREIRANU FUNKCIJU POZIVAMO KAO DRUGI FILTER
    //KROZ KOJI CE PROLAZITI ORIGINALNI JSON FAJL. POZIVAMO JE U PRIKAZI KNJIGE, ODMA ISPOD PISACFILTER
    let niz = []; // 52 KREIRAMO NIZ KOJI CE CINITI VREDNOSTI CEKIRANIH ELEMENATA
    let chekirani = document.querySelectorAll(".zanr:checked");
    chekirani.forEach(function (elem) {
      niz.push(parseInt(elem.value));
    });

    if (niz.length != 0) {//53 U DATA OSTAJU ELEMENTI KOJI ODGOVARAJU SLEDEOJ PROVERI
      return data.filter((elem) => elem.zanrovi.some((y) => niz.includes(y)));
    }           //54    elem je element data niza    some vraca da ili ne za uslov i zagradi 
    //(y je pojedinacna vrednost za zanr u svakoj knjizi, ako se nalazi u nizu onda vraca true
                //i element ostaje u data)
    return data;
  }

  function stanjeFilter(data) { //55 kreiramo filter za dostupnost proizvoda, i pozivamo stanjeFilter u ispisiKnjige
    // na vrhu stranice dohvatamo dom elemente za stanje, i postavljamo listener
    let dostupnost = document.querySelector("input[name='stanje']:checked").value; //59 s obzirom da radio button moze
    //                                     da bude cekiran samo jedan, necemo dobiti niz, vec samo jednu vrednost
    if (dostupnost == "dostupno") { //60 ispitujemo da li je value = dostupno
      return data.filter((x) => x.naStanju); //61 ukoliko jeste, filtriramo prosledjeni JSON 
    } else {
      return data.filter((x) => !x.naStanju); // 62 ukoliko nije filtriramo sa negacijom zato sto je vrednost svojstva 
      //                                                                na stanju true ili false
    }
  }

  function searchFilter(data) { //63 kreiramo filter za pretragu i pozivamo ga u okviru ispisiKnjige
            //postavljamo listener na vrhu stranice, na element sa id= pretraga
    let search = document.getElementById("pretraga").value.trim().toLowerCase();
    //65 smestamo vrednost unetu u seacrh polje, trimujemo i  setujemo na mala slova, kako bismo izbegli greske u pretrazi
    if (search) {//66 ukoliko postoji vrednost filtriramo JSON
      return data.filter((elem) => elem.naslov.toLowerCase().indexOf(search) != -1);
    }
    return data;
  }

  function sort(data) { //67 kreiramo filter za sortiranje, pozivamo ga u okviru ispisi knjige i postavljamo listener
    let vr = document.getElementById("sort").value; //69 preuzimamo vrednost selektovane opcije
    if (vr == "asc") { //70 ukoliko je opadajuca
      return data.sort((a, b) => parseInt(a.price.novaCena) > parseInt(b.price.novaCena) ? 1 : -1);
    }
    return data.sort((a, b) => parseInt(a.price.novaCena) < parseInt(b.price.novaCena) ? 1 : -1);
  }
};
