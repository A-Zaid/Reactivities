using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using MediatR;
using Persistence;
using Microsoft.EntityFrameworkCore;
using Application.Errors;
using System.Net;
using Domain;

namespace Application.Followers
{
    public class Delete
    {
        public class Command : IRequest
        {
            public string Username { get; set; }
        }
        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var observer = await _context.Users.SingleOrDefaultAsync(x => x.UserName ==
                _userAccessor.getCurrentUserName());

                var target = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

                if (target == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "Not found" });
                var following = await _context.Followings.SingleOrDefaultAsync(x => x.TargetId ==
                target.Id && x.ObserverId == observer.Id);

                if (following == null)
                    throw new RestException(HttpStatusCode.BadRequest, new { User = "You are not following this user" });

                if (following != null){
                    _context.Followings.Remove(following);
                }


                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;
                throw new Exception("Problem saving changes");
            }
        }
    }
}