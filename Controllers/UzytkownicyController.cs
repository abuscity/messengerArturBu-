using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using WebAPI.Models;

namespace WebAPI.Controllers
{
  public class UzytkownicyController : ApiController
  {
    private arturDBEntities db = new arturDBEntities();

    [EnableCors("*", "*", "GET")]
    [Route("api/Uzytkownicy/Login/{nazwa}/{haslo}")]
    public IHttpActionResult GetLogin(string nazwa, string haslo)
    {
      var uzytkownicy = db.Uzytkownicies.Where(u => (u.Login == nazwa && u.Haslo == haslo)).FirstOrDefault();
      if (uzytkownicy != null)
        return Ok(uzytkownicy.Id);
      else
      {
        return Ok(false);
      }
    }
    // GET: api/Uzytkownicy
    [EnableCors("*", "*", "GET")]
    public IQueryable<object> GetUzytkownicies()
    {
      return db.Uzytkownicies.Select(x=> new {Id = x.Id, Login= x.Login});
    }

    // GET: api/Uzytkownicy/5
    [ResponseType(typeof(Uzytkownicy))]
    public IHttpActionResult GetUzytkownicy(int id)
    {
      Uzytkownicy uzytkownicy = db.Uzytkownicies.Find(id);
      if (uzytkownicy == null)
      {
        return NotFound();
      }

      return Ok(uzytkownicy);
    }

    // PUT: api/Uzytkownicy/5
    [ResponseType(typeof(void))]
    public IHttpActionResult PutUzytkownicy(int id, Uzytkownicy uzytkownicy)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      if (id != uzytkownicy.Id)
      {
        return BadRequest();
      }

      db.Entry(uzytkownicy).State = EntityState.Modified;

      try
      {
        db.SaveChanges();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!UzytkownicyExists(id))
        {
          return NotFound();
        }
        else
        {
          throw;
        }
      }

      return StatusCode(HttpStatusCode.NoContent);
    }

    // POST: api/Uzytkownicy
    [ResponseType(typeof(Uzytkownicy))]
    public IHttpActionResult PostUzytkownicy(Uzytkownicy uzytkownicy)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      db.Uzytkownicies.Add(uzytkownicy);
      db.SaveChanges();

      return CreatedAtRoute("DefaultApi", new { id = uzytkownicy.Id }, uzytkownicy);
    }

    protected override void Dispose(bool disposing)
    {
      if (disposing)
      {
        db.Dispose();
      }
      base.Dispose(disposing);
    }

    private bool UzytkownicyExists(int id)
    {
      return db.Uzytkownicies.Count(e => e.Id == id) > 0;
    }
  }
}