using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    public class ChatController : ApiController
    {
        private arturDBEntities db = new arturDBEntities();

    // GET: api/Chat
      [EnableCors("*", "*", "GET")]
      [Route("api/Chat/{id1}/{id2}")]

    public IQueryable<Wiadomosci> GetWiadomoscis(int id1, int id2)
      {
        var wiadomosci = from w in db.Wiadomoscis
          where w.Od == id1 && w.Do == id2 || w.Do == id1 && w.Od == id2
                         orderby w.Data
          select w;
            return wiadomosci;
        }
      [EnableCors("*", "*", "PUT")]

      public IHttpActionResult PutWiadomoscis(Wiadomosci wiadomosc)
      {
      if (!ModelState.IsValid)
        {
          return BadRequest(ModelState);
        }
      
        db.Wiadomoscis.Add(wiadomosc);

        try
        {
          db.SaveChanges();
        
        }
        catch (Exception ex)
        {
        StringBuilder sb = new StringBuilder("Lini");
          foreach (var error in db.GetValidationErrors())
          {
            sb.AppendLine(error.ToString());
          }
          return BadRequest(sb.ToString()+ ex.ToString());
        }
        return Ok();
      }
    // GET: api/Chat/5
    [ResponseType(typeof(Wiadomosci))]
        public IHttpActionResult GetWiadomosci(int id)
        {
            Wiadomosci wiadomosci = db.Wiadomoscis.Find(id);
            if (wiadomosci == null)
            {
                return NotFound();
            }

            return Ok(wiadomosci);
        }

        // PUT: api/Chat/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutWiadomosci(int id, Wiadomosci wiadomosci)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != wiadomosci.Id)
            {
                return BadRequest();
            }

            db.Entry(wiadomosci).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!WiadomosciExists(id))
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

        // POST: api/Chat
        [ResponseType(typeof(Wiadomosci))]
        public IHttpActionResult PostWiadomosci(Wiadomosci wiadomosci)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Wiadomoscis.Add(wiadomosci);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (WiadomosciExists(wiadomosci.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = wiadomosci.Id }, wiadomosci);
        }

        // DELETE: api/Chat/5
        [ResponseType(typeof(Wiadomosci))]
        public IHttpActionResult DeleteWiadomosci(int id)
        {
            Wiadomosci wiadomosci = db.Wiadomoscis.Find(id);
            if (wiadomosci == null)
            {
                return NotFound();
            }

            db.Wiadomoscis.Remove(wiadomosci);
            db.SaveChanges();

            return Ok(wiadomosci);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool WiadomosciExists(int id)
        {
            return db.Wiadomoscis.Count(e => e.Id == id) > 0;
        }
    }
}